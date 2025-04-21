# MixPanel and Analytics Properties

## MixPanel Events for the MixPanel `{Track Event}` Card

### Conversation events
- **user_question**  
  *When to fire*: each inbound user message  
  *Properties*: {{event.conversationId}}, {{event.preview}}

- **ai_answer**  
  *When to fire*: bot sends a reply  
  *Properties*: {{event.conversationId}}

- **clarification_requested**  
  *When to fire*: bot asks a clarifying question  
  *Properties*: {{event.conversationId}}, {{workflow.clarification_count}}, {{workflow.clarification_reason}} ("ambiguous_intent" | "missing_details")

- **clarification_resolved**  
  *When to fire*: user provides info and bot resumes normal flow  
  *Properties*: {{event.conversationId}}, {{workflow.clarification_count}}

- **clarification_loop_exceeded**  
  *When to fire*: more than two clarification cycles without resolution  
  *Properties*: {{event.conversationId}}, {{workflow.clarification_count}}


### Knowledge‑base events
- **kb_query**  
  *When to fire*: bot executes a search against KB‑1 or KB‑2  
  *Properties*: {{event.conversationId}}, {{event.preview}}, {{workflow.kb_source}}

- **kb_hit**  
  *When to fire*: a document is found and cited  
  *Properties*: {{event.conversationId}}, {{workflow.kb_source}}

- **kb_miss**  
  *When to fire*: no relevant document returned  
  *Properties*: {{event.conversationId}}, {{event.preview}}


### Escalation / deflection events
- **fallback_condition_met**  
  *When to fire*: any prompt fallback trigger (a–d) is hit  
  *Properties*: {{event.conversationId}}, {{workflow.escalation_trigger}} ("human_requested" | "sentiment_low" | "clarification_fail" | "dual_rejection")

- **transfer_to_agent**  
  *When to fire*: bot hands off via `{speakToAgent}`  
  *Properties*: {{event.conversationId}}

- **deflection_success**  
  *When to fire*: user accepts the bot’s answer  
  *Properties*: {{event.conversationId}}, {{workflow.attempts_before_success}}