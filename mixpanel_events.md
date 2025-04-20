### General events
| Event | When to fire | Include these properties |
|-------|--------------|--------------------------|
| `conversation_started` | First user message (or first bot greeting if no user input yet). | `session_id`, `started_at`, `initial_route`, `user_id` |
| `conversation_ended` | Bot or agent explicitly ends the thread. | `session_id`, `ended_at`, `duration_seconds`, `resolution` (`bot`, `human`), `messages_total` |
| `conversation_timeout` | No user input for *n* minutes → session auto‑closes. | `session_id`, `idle_seconds`, `route`, `started_at`, `ended_at` |
| `error` | Uncaught exception or failed API / KB call. | `session_id`, `error_type`, `error_message`, `step_name`, `timestamp` |

### Conversation events
| Event | When to fire | Include these properties |
|-------|--------------|--------------------------|
| `user_question` | Each inbound user message. | `session_id`, `message_id`, `text`, `timestamp`, `sentiment_score` |
| `ai_answer` | Bot sends a reply. | `session_id`, `message_id`, `answer_id`, `tokens_used`, `latency_ms`, `cited_docs` (array) |
| `clarification_requested` | Bot asks a clarifying question. | `session_id`, `clarification_count`, `reason` (`ambiguous_intent`, `missing_details`), `timestamp` |
| `clarification_resolved` | User provides info and bot resumes normal flow. | `session_id`, `clarification_count`, `resolved_at` |
| `clarification_loop_exceeded` | >2 clarification cycles without resolution. | `session_id`, `total_clarifications`, `loop_time_seconds` |

### Knowledge‑base events
| Event | When to fire | Include these properties |
|-------|--------------|--------------------------|
| `kb_query` | Bot executes a search against KB‑1 or KB‑2. | `session_id`, `query`, `kb_source` (`primary`, `secondary`), `timestamp` |
| `kb_hit` | A doc is found and cited. | `session_id`, `doc_id`, `kb_source`, `rank`, `latency_ms` |
| `kb_miss` | No relevant doc returned. | `session_id`, `query`, `kb_source` |

### Escalation deflection events
| Event | When to fire | Include these properties |
|-------|--------------|--------------------------|
| `fallback_condition_met` | Any (a‑d) fallback trigger in the prompt is hit. | `session_id`, `trigger` (`human_requested`, `sentiment_low`, `clarification_fail`, `dual_rejection`), `timestamp` |
| `transfer_to_agent` | Bot hands off via `{speakToAgent}`. | `session_id`, `reason`, `route`, `conversation_duration`, `agent_queue_time_ms` |
| `deflection_success` | User initially wanted an agent but accepts bot answer. | `session_id`, `attempts_before_success`, `route`, `timestamp` |

### Feedback events
| Event | When to fire | Include these properties |
|-------|--------------|--------------------------|
| `positive_feedback` | User clicks 👍 or similar. | `session_id`, `message_id`, `rating` (`positive`), `timestamp` |
| `negative_feedback` | User clicks 👎 or similar. | `session_id`, `message_id`, `rating` (`negative`), `timestamp`, `reason_text` (if captured) |
| `feedback_skipped` | User ends session without rating. | `session_id`, `message_id`, `timestamp` |

### Route‑selection events
| Event | When to fire | Include these properties |
|-------|--------------|--------------------------|
| `affiliate_support` | User picks or is routed to Affiliate Support. | `session_id`, `selection_method` (`quick_reply`, `nlp_intent`), `previous_route`, `timestamp` |
| `billing_support` | Routed to Billing. | *(same prop list as above)* |
| `technical_support` | Routed to Technical Support. | *(same prop list as above)* |
| `user_indicated_completed` | User signals their issue is resolved. | `session_id`, `resolution_time_seconds`, `route` |

### Cost performance events
| Event | When to fire | Include these properties |
|-------|--------------|--------------------------|
| `llm_usage` | After every LLM completion. | `session_id`, `prompt_tokens`, `completion_tokens`, `total_tokens`, `latency_ms`, `model`, `cost_usd` |