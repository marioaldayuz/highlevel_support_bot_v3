### General events
- **conversation_started**  
  *When to fire*: first user message (or the bot’s initial greeting if no user input yet)  
  *Properties*: `session_id`, `started_at`, `initial_route`, `user_id`

- **conversation_ended**  
  *When to fire*: bot or agent explicitly ends the thread  
  *Properties*: `session_id`, `ended_at`, `duration_seconds`, `resolution` (`bot` | `human`), `messages_total`

- **conversation_timeout**  
  *When to fire*: no user input for *n* minutes and the session auto‑closes  
  *Properties*: `session_id`, `idle_seconds`, `route`, `started_at`, `ended_at`

- **error**  
  *When to fire*: uncaught exception or failed API / KB call  
  *Properties*: `session_id`, `error_type`, `error_message`, `step_name`, `timestamp`


### Conversation events
- **user_question**  
  *When to fire*: each inbound user message  
  *Properties*: `session_id`, `message_id`, `text`, `timestamp`, `sentiment_score`

- **ai_answer**  
  *When to fire*: bot sends a reply  
  *Properties*: `session_id`, `message_id`, `answer_id`, `tokens_used`, `latency_ms`, `cited_docs` (array)

- **clarification_requested**  
  *When to fire*: bot asks a clarifying question  
  *Properties*: `session_id`, `clarification_count`, `reason` (`ambiguous_intent` | `missing_details`), `timestamp`

- **clarification_resolved**  
  *When to fire*: user provides info and bot resumes normal flow  
  *Properties*: `session_id`, `clarification_count`, `resolved_at`

- **clarification_loop_exceeded**  
  *When to fire*: more than two clarification cycles without resolution  
  *Properties*: `session_id`, `total_clarifications`, `loop_time_seconds`


### Knowledge‑base events
- **kb_query**  
  *When to fire*: bot executes a search against KB‑1 or KB‑2  
  *Properties*: `session_id`, `query`, `kb_source` (`primary` | `secondary`), `timestamp`

- **kb_hit**  
  *When to fire*: a document is found and cited  
  *Properties*: `session_id`, `doc_id`, `kb_source`, `rank`, `latency_ms`

- **kb_miss**  
  *When to fire*: no relevant document returned  
  *Properties*: `session_id`, `query`, `kb_source`


### Escalation / deflection events
- **fallback_condition_met**  
  *When to fire*: any prompt fallback trigger (a–d) is hit  
  *Properties*: `session_id`, `trigger` (`human_requested` | `sentiment_low` | `clarification_fail` | `dual_rejection`), `timestamp`

- **transfer_to_agent**  
  *When to fire*: bot hands off via `{speakToAgent}`  
  *Properties*: `session_id`, `reason`, `route`, `conversation_duration`, `agent_queue_time_ms`

- **deflection_success**  
  *When to fire*: user initially wanted an agent but accepts the bot’s answer  
  *Properties*: `session_id`, `attempts_before_success`, `route`, `timestamp`


### Feedback events
- **positive_feedback**  
  *When to fire*: user clicks 👍 or equivalent  
  *Properties*: `session_id`, `message_id`, `rating` (`positive`), `timestamp`

- **negative_feedback**  
  *When to fire*: user clicks 👎 or equivalent  
  *Properties*: `session_id`, `message_id`, `rating` (`negative`), `timestamp`, `reason_text` (if captured)

- **feedback_skipped**  
  *When to fire*: user ends session without rating  
  *Properties*: `session_id`, `message_id`, `timestamp`


### Route‑selection events
- **affiliate_support**  
  *When to fire*: user is routed to Affiliate Support  
  *Properties*: `session_id`, `selection_method` (`quick_reply` | `nlp_intent`), `previous_route`, `timestamp`

- **billing_support**  
  *When to fire*: user is routed to Billing Support  
  *Properties*: same as `affiliate_support`

- **technical_support**  
  *When to fire*: user is routed to Technical Support  
  *Properties*: same as `affiliate_support`

- **user_indicated_completed**  
  *When to fire*: user signals their issue is resolved  
  *Properties*: `session_id`, `resolution_time_seconds`, `route`


### Cost / performance events
- **llm_usage**  
  *When to fire*: after every LLM completion  
  *Properties*: `session_id`, `prompt_tokens`, `completion_tokens`, `total_tokens`, `latency_ms`, `model`, `cost_usd`
