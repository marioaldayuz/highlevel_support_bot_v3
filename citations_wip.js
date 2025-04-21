

  const TRUNCATE_LENGTH = 35
  const MAX_CITATIONS = 3
  const MIN_SCORE_THRESHOLD = 0.6

  // Log the start point to verify the code is running
  console.log('Starting citation processing')

  if (!outgoingEvent?.citations?.length) {
    console.log('No citations found, returning')
    return
  }

  // Log available citations
  console.log(`Found ${outgoingEvent.citations.length} citations`)

  const uniqueCitations = _.uniqBy(
    outgoingEvent.citations.map((e) => {
      // The URL is in source.title, not source.url
      const url = (e.citation.source && e.citation.source.title) || ''
      const src = (e.citation.source && e.citation.source.docId) || ''
      const score = e.citation.source.score || 0
      const kbId = e.citation.source.kbId || ''
      const kbDescription = e.citation.source.kbDescription || ''

      // Extract article ID from URL (if it exists and is from HighLevel help site)
      let articleId = null
      let fallbackTitle = ''

      if (url && url.toLowerCase().includes('articles')) {
        const parts = url.split('/')
        // Find the part that starts with a number and might include a hyphen
        const articlePart = parts.find((part) => /^\d+(-|$)/.test(part))

        if (articlePart) {
          // Extract just the numeric portion before any hyphen
          articleId = articlePart.split('-')[0]
          console.log(`Extracted article ID: ${articleId} from URL: ${url}`)
        }

        // Create a more readable fallback title from the URL
        const urlPath = url.split('/').pop() || ''
        fallbackTitle = urlPath.replace(/-/g, ' ').trim()
        fallbackTitle = _.startCase(fallbackTitle || 'Article')
      } else if (url) {
        // For non-article URLs, use the last segment as title
        const segments = url.split('/').filter(Boolean)
        fallbackTitle = segments.length ? _.startCase(_.last(segments)) : 'Resource'
      } else {
        // If no URL available, use source ID or generic fallback
        fallbackTitle = src ? `Document ${src.substring(0, 8)}...` : 'Unknown Resource'
      }

      return {
        title: fallbackTitle,
        url,
        srcs: src,
        articleId,
        score,
        kbId
      }
    }),
    'srcs'
  )

  console.log('Unique citations:', uniqueCitations)

  // Enrich titles from DB
  for (const citation of uniqueCitations) {
    if (!citation.articleId) {
      console.log(`No articleId for this citation; skipping DB lookup`)
      continue
    }

    console.log(`Looking up article ID "${citation.articleId}" in sitemapTable…`)
    let results
    try {
      results = await client.findTableRows({
        table: 'sitemapTable',
        filter: { articleId: { $eq: citation.articleId } },
        limit: 1
      })
    } catch (error) {
      console.error(`DB query failed for ID ${citation.articleId}:`, error)
      continue
    }

    console.log(`Raw DB result for ${citation.articleId}:`, JSON.stringify(results, null, 2))

    if (results && results.rows && results.rows.length > 0 && results.rows[0].title) {
      const dbTitle = results.rows[0].title
      console.log(`Replacing fallback "${citation.title}" with DB title: "${dbTitle}"`)
      citation.title = dbTitle
    } else {
      console.log(`No row or title found for ID ${citation.articleId}; keeping "${citation.title}"`)
    }
  }

  // Sort all citations by score in descending order and limit to MAX_CITATIONS
  const sortedCitations = _.take(_.orderBy(uniqueCitations, ['score'], ['desc']), MAX_CITATIONS)

  // Convert citations to an object with numeric keys
  const citationsObject = {}
  sortedCitations.forEach((citation, index) => {
    citationsObject[index] = citation
  })

  // Store as object in conversation
  conversation.citations = citationsObject

  // Filter citations for display only (still use the array form for processing)
  const displayCitations = sortedCitations.filter((citation) => citation.score >= MIN_SCORE_THRESHOLD)

  // Calculate average confidence based on MIN_SCORE_THRESHOLD as baseline
  const calculateConfidence = (citations) => {
    if (!citations.length) return 0

    const totalDiff = citations.reduce((acc, citation) => {
      return acc + (citation.score - MIN_SCORE_THRESHOLD)
    }, 0)

    return totalDiff / citations.length
  }

  // Create unique kbId object
  const extractKbIds = (citations) => {
    const kbIdObj = {}

    citations.forEach((citation) => {
      if (citation.kbId) {
        kbIdObj[citation.kbId] = true
      }
    })

    return kbIdObj
  }

  // Store results in conversation variables
  conversation.confidence = parseFloat(calculateConfidence(sortedCitations).toFixed(6))
  conversation.kbId = extractKbIds(sortedCitations)

  console.log('Top citations stored:', conversation.citations)
  console.log('Confidence score:', conversation.confidence)
  console.log('KB IDs:', conversation.kbId)

  // Format as Markdown links for the response (only those above threshold)
  const formattedCitations = displayCitations.map((citation) => {
    console.log(`Formatting citation with final title: "${citation.title}"`)
    return `[${citation.title}](${citation.url})`
  })

  console.log('Formatted Citations:', formattedCitations)

  if (formattedCitations.length > 0) {
    const sourcesText = `\n\n**Source(s)**:\n - ${formattedCitations.join('\n - ')}`

    outgoingEvent.preview += sourcesText
    outgoingEvent.payload.text += sourcesText
  }
