## ADDED Requirements

### Requirement: Real-time Buzz delivery

A joined sender SHALL submit "buzz:send" with a target session ID. For an accepted request, the server SHALL create a UUID and ISO 8601 timestamp, return the authoritative Buzz record to the sender acknowledgment, and emit one "buzz:received" event to the target socket.

#### Scenario: Deliver Buzz to an online target

- **GIVEN** Roy and Bei are joined
- **WHEN** Roy sends Buzz to Bei's session ID
- **THEN** Roy receives a successful acknowledgment and Bei receives one Buzz event with the same ID, sender, target, and timestamp

### Requirement: Buzz user experience

Both participants' chat windows SHALL add a system message for an accepted Buzz. Only the recipient SHALL invoke the existing synthesized chime and chat-window shake; the sender SHALL not invoke those recipient effects.

#### Scenario: Recipient handles Buzz

- **WHEN** Bei receives Roy's authoritative Buzz event
- **THEN** Bei's chat window adds a Buzz system message, attempts to play the chime, and shakes the window

#### Scenario: Sender handles accepted Buzz

- **WHEN** Roy receives a successful Buzz acknowledgment
- **THEN** Roy's chat window adds a Buzz system message without playing the chime or shaking the window

### Requirement: Per-pair Buzz cooldown

The server SHALL accept at most one Buzz from the same sender session to the same target session within any 3,000 millisecond interval. Cooldown state SHALL be server-owned and in memory.

#### Scenario: Reject rapid repeated Buzz

- **GIVEN** Roy has sent an accepted Buzz to Bei
- **WHEN** Roy sends another Buzz to Bei before 3,000 milliseconds have elapsed
- **THEN** the server returns error code "BUZZ_COOLDOWN" with a nonnegative retry delay and emits no second recipient event

#### Scenario: Accept Buzz after cooldown

- **GIVEN** Roy sent an accepted Buzz to Bei at least 3,000 milliseconds earlier
- **WHEN** Roy sends Buzz to Bei again
- **THEN** the server accepts and delivers the new Buzz

#### Scenario: Cooldown is pair-specific

- **GIVEN** Roy has sent an accepted Buzz to Bei within the last 3,000 milliseconds
- **WHEN** Roy sends Buzz to Tom
- **THEN** the server evaluates the Roy-to-Tom pair independently and accepts it when that pair has no active cooldown

### Requirement: Invalid Buzz failure

The server SHALL reject Buzz from an unjoined sender or Buzz targeting an absent session without recipient effects or system messages.

#### Scenario: Target is offline

- **WHEN** a joined sender submits Buzz to a disconnected session ID
- **THEN** the server returns error code "RECIPIENT_OFFLINE" and emits no Buzz event

#### Scenario: Surface Buzz error

- **WHEN** the frontend receives a failed Buzz acknowledgment
- **THEN** the sender's chat window displays the error and does not add a successful Buzz system message

### Requirement: Ephemeral Buzz state

Buzz events and cooldown records SHALL remain in memory only and SHALL be cleared by a server restart.

#### Scenario: Restart clears cooldown

- **GIVEN** a sender-recipient pair has an active Buzz cooldown
- **WHEN** the backend process restarts
- **THEN** the new process contains no cooldown record for that pair
