# Delog domain context

Delog centralizes logs from services in a local cluster and connects records to source,
log-driven tests, and notifications. The owner administers one self-hosted instance.

- **Record**: immutable logged event with epoch-microsecond time, severity 1–6, text,
  project, space, optional error/data, and optional correlation/source context.
- **Project**: owner-scoped application grouping. **Space**: project-scoped subsystem.
- **Token**: revocable ingestion credential; never grants administrative access.
- **Tester**: ordered expected phases selected by project, suite, and scenario.
- **Test**: persisted evaluation of correlated records identified by sharedID.
- **Notifier**: owner-configured HTTP or email destination subscribed to events.
- **Format**: named text template with substitutions; never executable code.
- **Provider / Repository**: authenticated source provider and explicitly linked repository.
- **Plane**: a Plurid content surface; links open related content beside its origin.

Invariants: acknowledged records are committed; every data operation is owner-scoped;
ingestion and administration credentials are distinct; secrets never appear in list
responses; imports do not open databases, bind ports, or start timers; background work is
durable and bounded; delete/retention operations are explicit and tenant-scoped.
