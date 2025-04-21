  document.addEventListener('DOMContentLoaded', () => {
    // Grab the root Vue instance
    const vueRoot = document.getElementById('app')?.__vue__ || {};

    // Pull the first location (if any)
    const firstLocation = vueRoot.locations?.[0] ?? null;
    let locationName = '';
    let locationId   = '';
    if (firstLocation) {
      locationName = firstLocation.name ?? '';
      locationId   = firstLocation.id   ?? '';
    }

    // Pull user data
    const userEmail          = vueRoot.user?.email        ?? '';
    const locale             = vueRoot.user?.localeString ?? 'en';
    const visitorId          = vueRoot.user?.id           ?? '';
    const userRole           = vueRoot.user?.role         ?? '';
    const userPermissions    = vueRoot.user?.type         ?? '';
    const userName           = vueRoot.user?.name         ?? '';

    // Pull agency/company data
    const agencyRelationshipId = vueRoot.company?.relationshipNumber ?? '';
    const agencyName           = vueRoot.company?.name               ?? '';
    const agencyWhiteLabelUrl  = vueRoot.company?.domain             ?? '';
    const agencyLocationCount  = vueRoot.company?.locationCount      ?? 0;
    const hipaaEnabled         = vueRoot.company?.hipaaCompliance    ?? false;
    const activePlan           = vueRoot.company?.stripeActivePlan   ?? '';

    // Initialize Botpress
    window.botpress.init({
      botId: '6a141421-9ba3-4787-8ee6-81f0012950d7',
      configuration: {
        composerPlaceholder: "Let's get started!",
        botName:            'HighLevel Support Chat',
        botAvatar:          'https://files.bpcontent.cloud/2025/04/20/01/20250420015512-XTCLY0NC.webp',
        botDescription:     "Hi, my name is Highly and I am HighLevel's experimental Support AI. Please be patient with me as I am still learning! If you'd like to speak to one of my Human Agents simply say \"Agent\" at any time during the conversation.",
        website: {}, email: {}, phone: {}, termsOfService: {}, privacyPolicy: {},
        color: '#5eb1ef', variant: 'soft', themeMode: 'light',
        fontFamily: 'inter', radius: 1, showPoweredBy: false,
        allowFileUpload: true
      },
      clientId: '7d4c6367-dc4a-4a41-a9a4-bf5c2d3ef280',
      user: {
        data: {
          email:                   userEmail,
          agencyName:              agencyName,
          locationId:              locationId,
          locationName:            locationName,
          name:                    userName,
          relationshipId:          agencyRelationshipId,
          userPermissions:         userPermissions,
          userRole:                userRole,
          visitorId:               visitorId,
          agencyWhiteLabelUrl:     agencyWhiteLabelUrl,
          agencyLocationCount:     agencyLocationCount,
          hipaaEnabled:            hipaaEnabled,
          activePlan:              activePlan,
          currentUrl:              window.location.href,
          language:                locale
        }
      }
    });
  });