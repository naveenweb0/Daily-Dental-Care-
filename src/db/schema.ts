import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  date,
  uniqueIndex,
  index,
  jsonb,
} from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    role: text("role").notNull().default("receptionist"), // super_admin | admin | receptionist
    active: boolean("active").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [uniqueIndex("users_email_idx").on(t.email)],
);

export const sessions = pgTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("sessions_user_idx").on(t.userId)],
);

export const services = pgTable(
  "services",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    shortDescription: text("short_description").notNull().default(""),
    description: text("description").notNull().default(""),
    image: text("image").notNull().default(""),
    durationMinutes: integer("duration_minutes").notNull().default(30),
    price: text("price").notNull().default("Contact for price"),
    benefits: jsonb("benefits").$type<string[]>().notNull().default([]),
    procedure: jsonb("procedure").$type<string[]>().notNull().default([]),
    suitableFor: jsonb("suitable_for").$type<string[]>().notNull().default([]),
    faqs: jsonb("faqs").$type<{ q: string; a: string }[]>().notNull().default([]),
    active: boolean("active").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    seoTitle: text("seo_title").notNull().default(""),
    seoDescription: text("seo_description").notNull().default(""),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [uniqueIndex("services_slug_idx").on(t.slug)],
);

export const doctors = pgTable("doctors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  photo: text("photo").notNull().default(""),
  qualification: text("qualification").notNull().default(""),
  specialization: text("specialization").notNull().default(""),
  bio: text("bio").notNull().default(""),
  experience: text("experience").notNull().default(""),
  active: boolean("active").notNull().default(true),
  serviceIds: jsonb("service_ids").$type<number[]>().notNull().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// clinic hours: doctorId null => clinic level
export const clinicHours = pgTable(
  "clinic_hours",
  {
    id: serial("id").primaryKey(),
    doctorId: integer("doctor_id").references(() => doctors.id, { onDelete: "cascade" }),
    weekday: integer("weekday").notNull(), // 0 Sunday .. 6 Saturday
    isOpen: boolean("is_open").notNull().default(true),
    openTime: text("open_time").notNull().default("10:00"),
    closeTime: text("close_time").notNull().default("19:00"),
    breakStart: text("break_start").notNull().default("13:00"),
    breakEnd: text("break_end").notNull().default("14:00"),
  },
  (t) => [index("clinic_hours_doctor_idx").on(t.doctorId)],
);

export const blockedDates = pgTable(
  "blocked_dates",
  {
    id: serial("id").primaryKey(),
    doctorId: integer("doctor_id").references(() => doctors.id, { onDelete: "cascade" }),
    blockDate: date("block_date").notNull(),
    startTime: text("start_time"), // null => whole day
    endTime: text("end_time"),
    reason: text("reason").notNull().default(""),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("blocked_dates_date_idx").on(t.blockDate)],
);

export const patients = pgTable(
  "patients",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    phone: text("phone").notNull(),
    email: text("email").notNull().default(""),
    passwordHash: text("password_hash"),
    gender: text("gender").notNull().default("other"), // male | female | other
    bloodGroup: text("blood_group").notNull().default(""),
    age: integer("age"),
    address: text("address").notNull().default(""),
    medicalHistory: text("medical_history").notNull().default(""),
    emergencyContact: text("emergency_contact").notNull().default(""),
    notes: text("notes").notNull().default(""),
    source: text("source").notNull().default("website"),
    isDemo: boolean("is_demo").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("patients_phone_idx").on(t.phone),
    index("patients_email_idx").on(t.email),
  ],
);

export const patientSessions = pgTable(
  "patient_sessions",
  {
    id: text("id").primaryKey(),
    patientId: integer("patient_id")
      .notNull()
      .references(() => patients.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("patient_sessions_patient_idx").on(t.patientId)],
);

export const clinicalRecords = pgTable(
  "clinical_records",
  {
    id: serial("id").primaryKey(),
    patientId: integer("patient_id")
      .notNull()
      .references(() => patients.id, { onDelete: "cascade" }),
    appointmentId: integer("appointment_id").references(() => appointments.id, {
      onDelete: "set null",
    }),
    doctorId: integer("doctor_id").references(() => doctors.id, {
      onDelete: "set null",
    }),
    doctorName: text("doctor_name").notNull().default("Daily Dental Care Doctor"),
    visitDate: date("visit_date").notNull(),
    chiefComplaint: text("chief_complaint").notNull().default(""),
    diagnosis: text("diagnosis").notNull().default(""),
    treatmentDone: text("treatment_done").notNull().default(""),
    doctorRemarks: text("doctor_remarks").notNull().default(""),
    prescription: jsonb("prescription")
      .$type<{ medicine: string; dosage: string; frequency: string; duration: string; instructions: string }[]>()
      .notNull()
      .default([]),
    nextRecallDate: text("next_recall_date").notNull().default(""),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [
    index("clinical_records_patient_idx").on(t.patientId),
    index("clinical_records_appt_idx").on(t.appointmentId),
  ],
);

export const patientReports = pgTable(
  "patient_reports",
  {
    id: serial("id").primaryKey(),
    patientId: integer("patient_id")
      .notNull()
      .references(() => patients.id, { onDelete: "cascade" }),
    appointmentId: integer("appointment_id").references(() => appointments.id, {
      onDelete: "set null",
    }),
    title: text("title").notNull(),
    reportType: text("report_type").notNull().default("report"), // xray | prescription | lab_report | treatment_plan | invoice
    fileUrl: text("file_url").notNull().default(""),
    notes: text("notes").notNull().default(""),
    doctorRemarks: text("doctor_remarks").notNull().default(""),
    issuedDate: text("issued_date").notNull().default(""),
    uploadedBy: text("uploaded_by").notNull().default("Doctor"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("patient_reports_patient_idx").on(t.patientId)],
);

export const leads = pgTable(
  "leads",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    phone: text("phone").notNull(),
    email: text("email").notNull().default(""),
    serviceId: integer("service_id").references(() => services.id, { onDelete: "set null" }),
    patientId: integer("patient_id").references(() => patients.id, { onDelete: "set null" }),
    source: text("source").notNull().default("website"),
    stage: text("stage").notNull().default("new"),
    assignedTo: integer("assigned_to").references(() => users.id, { onDelete: "set null" }),
    notes: text("notes").notNull().default(""),
    message: text("message").notNull().default(""),
    isDemo: boolean("is_demo").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [
    index("leads_phone_idx").on(t.phone),
    index("leads_stage_idx").on(t.stage),
    index("leads_source_idx").on(t.source),
  ],
);

export const appointments = pgTable(
  "appointments",
  {
    id: serial("id").primaryKey(),
    appointmentNumber: text("appointment_number").notNull(),
    patientId: integer("patient_id")
      .notNull()
      .references(() => patients.id, { onDelete: "cascade" }),
    leadId: integer("lead_id").references(() => leads.id, { onDelete: "set null" }),
    doctorId: integer("doctor_id")
      .notNull()
      .references(() => doctors.id, { onDelete: "restrict" }),
    serviceId: integer("service_id").references(() => services.id, { onDelete: "set null" }),
    patientName: text("patient_name").notNull(),
    phone: text("phone").notNull(),
    email: text("email").notNull().default(""),
    age: integer("age"),
    appointmentDate: date("appointment_date").notNull(),
    startTime: text("start_time").notNull(),
    endTime: text("end_time").notNull(),
    status: text("status").notNull().default("new"),
    patientType: text("patient_type").notNull().default("new"),
    patientMessage: text("patient_message").notNull().default(""),
    internalNotes: text("internal_notes").notNull().default(""),
    cancellationReason: text("cancellation_reason").notNull().default(""),
    source: text("source").notNull().default("website"),
    isDemo: boolean("is_demo").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("appointments_number_idx").on(t.appointmentNumber),
    uniqueIndex("appointments_slot_idx").on(t.doctorId, t.appointmentDate, t.startTime),
    index("appointments_date_idx").on(t.appointmentDate),
    index("appointments_status_idx").on(t.status),
  ],
);

export const appointmentHistory = pgTable(
  "appointment_history",
  {
    id: serial("id").primaryKey(),
    appointmentId: integer("appointment_id")
      .notNull()
      .references(() => appointments.id, { onDelete: "cascade" }),
    action: text("action").notNull(),
    oldValue: text("old_value").notNull().default(""),
    newValue: text("new_value").notNull().default(""),
    actor: text("actor").notNull().default("system"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("appt_history_appt_idx").on(t.appointmentId)],
);

export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull().default(""),
  message: text("message").notNull().default(""),
  leadId: integer("lead_id").references(() => leads.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const notifications = pgTable(
  "notifications",
  {
    id: serial("id").primaryKey(),
    type: text("type").notNull(),
    title: text("title").notNull(),
    body: text("body").notNull().default(""),
    link: text("link").notNull().default(""),
    readAt: timestamp("read_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("notifications_read_idx").on(t.readAt)],
);

// outbound reminders / confirmations (integration-ready, status tracked)
export const notificationQueue = pgTable("notification_queue", {
  id: serial("id").primaryKey(),
  appointmentId: integer("appointment_id").references(() => appointments.id, {
    onDelete: "cascade",
  }),
  channel: text("channel").notNull(), // email | whatsapp | sms
  kind: text("kind").notNull(), // confirmation | reminder_24h | reminder_2h
  recipient: text("recipient").notNull().default(""),
  payload: text("payload").notNull().default(""),
  status: text("status").notNull().default("not_connected"),
  scheduledFor: timestamp("scheduled_for"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: jsonb("value").$type<Record<string, unknown>>().notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "set null" }),
  userName: text("user_name").notNull().default("system"),
  action: text("action").notNull(),
  entity: text("entity").notNull().default(""),
  entityId: text("entity_id").notNull().default(""),
  oldValue: text("old_value").notNull().default(""),
  newValue: text("new_value").notNull().default(""),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
