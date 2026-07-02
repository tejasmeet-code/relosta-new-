export const APPLICATIONS_WEBHOOK =
  "https://discord.com/api/webhooks/1511706823952957533/WmfrQfMnabOm2oGoNOMaiEJSB43WkWcMNmxXxZ9AWpdLBvU8R_X_9Yeh2H-wC3LzLxgl";

export const ADMIN_KEY = "&3$%#&&@*#@$@$#24";

export type RoleId =
  | "outreacher"
  | "marketer"
  | "social_media_manager"
  | "discord_staff"
  | "staff_manager"
  | "growth_manager"
  | "marketing_manager"
  | "general_manager";

export type Role = {
  id: RoleId;
  title: string;
  tier: "Execution & Operations" | "Management";
  tagline: string;
  benefits: string[];
  questions: string[];
};

const baseInfo = [
  "Name",
  "Age",
  "Time zone",
  "Discord username",
  "Discord user ID",
];

export const ROLES: Role[] = [
  {
    id: "outreacher",
    title: "Outreacher",
    tier: "Execution & Operations",
    tagline: "Source and close client deals through targeted cold outreach.",
    benefits: [
      "Direct Deal Commission: 10%–15% on the gross contract value of every closed client deal sourced by your outreach campaigns.",
      "Performance Bonuses: Cash rewards for maintaining consistent outreach quality and hitting weekly target milestones.",
      "Operational Perks: Access to verified lead lists, custom script templates, and fully provisioned outreach accounts.",
      "Fully remote position with flexible working hours.",
    ],
    questions: [
      ...baseInfo,
      "Experience: Tell us briefly about your experience with cold outreach or messaging prospects online. Have you worked with digital creators or brands before?",
      "Weekly Volume: Our standard expectation is 100–150 outreach messages per week. Can you consistently maintain this volume?",
      "Scenario: A creator replies saying, \"I'm interested, but I don't have time for a call right now.\" What do you reply to keep the conversation going?",
      "Organization: How do you keep track of the people you have messaged so you don't forget to follow up?",
      "Platform Preferences: Which platforms (Discord, X/Twitter, Instagram, Email) do you feel most confident using to find and pitch potential clients?",
      "Handling Rejection: Cold outreach involves a lot of no's. How do you maintain motivation and consistency on slow days?",
      "Research & Customization: How much time do you spend researching a creator or brand before sending a message so it looks personal rather than copy-pasted?",
    ],
  },
  {
    id: "marketer",
    title: "Marketing Specialist",
    tier: "Execution & Operations",
    tagline: "Build funnels, landing pages, and campaign infrastructure.",
    benefits: [
      "Base Project Rate: Flat fee paid per client campaign setup or technical buildout.",
      "Launch Bonuses: Extra cash incentives for error-free, on-schedule campaign launches.",
      "Operational Perks: Software and tools required for the job are provided.",
      "Opportunities to learn advanced funnel strategies directly from company leadership.",
    ],
    questions: [
      ...baseInfo,
      "Experience: Have you ever built marketing funnels, landing pages, or set up ad campaigns? Share 1–2 examples of your best work.",
      "Tools: Which marketing tools or platforms are you most comfortable with (e.g., WordPress, ClickFunnels, Zapier, Canva)?",
      "Scenario: A client says a sign-up link you set up isn't working for their audience. What's the first thing you check to fix it?",
      "Quality Check: We require a quick technical check on active links twice a week. Are you comfortable handling this independently?",
      "Data & Analytics: Have you ever set up or used tracking pixels or analytics tags (Google Analytics, Meta Pixel)? Briefly explain your comfort level.",
      "Working Under Deadlines: Tell us about a time you launched a marketing asset on a very tight timeline. How did you make sure everything was correct before launch?",
      "Creative Assets: If a client provides raw, unorganized graphics or text for a landing page, how do you structure them so the layout is clear and engaging?",
    ],
  },
  {
    id: "social_media_manager",
    title: "Social Media Manager",
    tier: "Execution & Operations",
    tagline: "Run client profiles end-to-end — content, scheduling, and engagement.",
    benefits: [
      "Monthly Retainer: Flat monthly pay per managed client profile or channel ecosystem.",
      "Growth Incentives: Extra rewards for outstanding content performance and zero-error scheduling streaks.",
      "Operational Perks: Access to scheduling software and shared cloud libraries for easy asset management.",
    ],
    questions: [
      ...baseInfo,
      "Experience: Share links to social media accounts (Instagram, TikTok, X, YouTube, etc.) you currently manage or have run in the past.",
      "Tools: What tools do you use to schedule posts and edit content (e.g., CapCut, Canva, Buffer, Metricool)?",
      "Scenario: You notice a typo in a post that has been live for 10 minutes and has a few views. What do you do?",
      "Scheduling: We aim to have content planned and locked 7 days in advance. Does your schedule allow you to stay that far ahead?",
      "Algorithm Trends: How do you stay updated with changing algorithms, trending audio, or shifting content styles within the creator space?",
      "Audience Engagement: How do you approach replying to comments and DMs on a client's account? What tone do you typically use?",
      "Content Planning: Walk us through how you outline a monthly content calendar. How do you balance promotional posts with regular community content?",
    ],
  },
  {
    id: "discord_staff",
    title: "Discord Staff (Moderator / Support)",
    tier: "Execution & Operations",
    tagline: "Moderate communities and run ticket support with care and precision.",
    benefits: [
      "Shift Pay: Flat rate per scheduled moderation shift window.",
      "Community Perks: Direct access to popular creator communities, premium internal staff ranks, and clear promotion paths to Team Lead positions.",
      "Operational Perks: Full onboarding and training on our internal moderation bots and safety systems.",
    ],
    questions: [
      ...baseInfo,
      "Experience: Have you moderated a Discord server before? If yes, list the servers and your main responsibilities.",
      "Tools: Which Discord bots are you familiar with for moderation or tickets (e.g., Dyno, Carl-bot, Ticket Tool)?",
      "Scenario: Two members are arguing aggressively in a public channel. No rules are explicitly broken yet, but it's making others uncomfortable. How do you handle it?",
      "Availability: How many hours a week can you commit to checking the server and answering support tickets? What days/times work best?",
      "Escalation Protocol: If a member opens a highly complex or sensitive ticket you're unsure how to resolve, what do you tell them while you wait for a manager's help?",
      "Rule Enforcement: How do you balance being a welcoming presence while still strictly enforcing the server guidelines when necessary?",
      "Dealing with Stress: Moderation can expose you to toxic users. How do you keep a calm, professional head when dealing with difficult internet users?",
    ],
  },
  {
    id: "staff_manager",
    title: "Staff Department Manager",
    tier: "Management",
    tagline: "Lead the Discord staff tier — hiring, audits, and culture.",
    benefits: [
      "Profit Share: 5% direct commission on the overall profits of the entire company.",
      "Leadership Perks: Authority over internal HR policies, hiring/firing privileges for the Discord staff tier, and a direct seat in executive operations.",
    ],
    questions: [
      ...baseInfo,
      "Management Background: Tell us about your experience managing people or leading a team of staff members in a remote environment.",
      "Staff Quality: How will you handle regular check-ins and audits on our Discord staff to ensure servers stay safe and active?",
      "Scenario: A moderator is consistently showing up late to their scheduled shift window. How do you address this with them?",
      "Hiring Standards: What qualities or green flags do you look for when reviewing applications for new moderators or support staff?",
      "Conflict Resolution: If two moderators have a personal disagreement that's affecting their performance during shared shifts, how do you intervene?",
      "Burnout Prevention: Online community staff often experience high burnout. What steps would you take to keep our moderation team motivated and supported?",
    ],
  },
  {
    id: "growth_manager",
    title: "Growth Department Manager",
    tier: "Management",
    tagline: "Own the client acquisition system, CRM, and outbound strategy.",
    benefits: [
      "Department Profit Share: 10% commission directly from the net profits generated by the Growth Department.",
      "Leadership Perks: Complete ownership of the client acquisition system, CRM architecture, and outbound strategy frameworks.",
    ],
    questions: [
      ...baseInfo,
      "Systems Background: Describe your experience managing outbound sales pipelines, lead lists, or CRM tracking systems.",
      "Data Organization: How do you make sure outreach lists stay organized and free of duplicate or bad lead data?",
      "Reporting: Are you comfortable reviewing pipeline data weekly and writing a brief update for the General Manager on what is and isn't working?",
      "Funnel Analysis: If Outreachers get high message response rates but few responses convert into client meetings, what areas of the funnel would you fix?",
      "Script Optimization: How often should an outreach script template be refreshed to prevent staleness? What indicators tell you it's time?",
      "Tool Integration: What's your experience linking tracking or automation platforms (e.g., lead sheets ↔ CRMs ↔ communication channels) to smooth the data pipeline?",
    ],
  },
  {
    id: "marketing_manager",
    title: "Marketing & Social Media Management Department Manager",
    tier: "Management",
    tagline: "Direct Outreachers, Marketers, and Social Media Managers across client campaigns.",
    benefits: [
      "Department Profit Share: 10% commission directly from the net profits generated by the Marketing & Social Media Department.",
      "Leadership Perks: Direct management over Outreachers, Marketers, and Social Media Managers. Ultimate approval power over client campaign deployments.",
    ],
    questions: [
      ...baseInfo,
      "Team Leadership: Tell us about your experience managing content creators, social media managers, or outreach teams.",
      "Workflow Control: Execution tier looks to you for directions and asset approvals daily. How do you stay organized to ensure no client deadlines are missed?",
      "Scenario: A client is unhappy because an Outreacher or SMM made a minor mistake on a public channel. How do you fix it with the client and handle it with the team member?",
      "Performance Checks: You'll run two mini-reviews per role weekly. What specific factors will you check to confirm your team is doing their job well?",
      "Inter-Department Harmony: Your team handles outreach volume, but Growth builds the funnel strategies. How do you ensure Outreachers execute those strategies perfectly?",
      "Quality Delegation: When a new client campaign arrives, how do you assess current capacity to distribute tasks between SMMs and Marketing Specialists?",
    ],
  },
  {
    id: "general_manager",
    title: "General Manager (GM)",
    tier: "Management",
    tagline: "Operational leadership across all departments, partnered with the COO.",
    benefits: [
      "Overall Profit Share: 3% direct commission from the overall gross profits of the entire agency holding company.",
      "Leadership Perks: Operational leadership over all three Department Managers. Direct partnership with the COO to scale internal systems.",
    ],
    questions: [
      ...baseInfo,
      "Operations Experience: Detail your history as a general manager, operations director, or running the day-to-day of a digital agency.",
      "Management Oversight: You'll supervise three managers (Staff, Growth, Marketing). How do you plan to keep them accountable to their goals?",
      "Reporting: You'll send a comprehensive weekly staff and operations report to the COO. Do you have experience translating daily team data into clear executive summaries?",
      "Friction Resolution: If the Staff Manager and Marketing Manager disagree on an internal operations change, how do you make an unbiased final decision that protects the agency?",
      "Workflow Bottlenecks: What is your immediate strategy when an entire department branch is falling behind on weekly reporting or system tasks?",
      "Scaling Strategy: As a small agency optimizing internal processes, what frameworks do you use to evaluate whether current administrative overhead is efficient?",
    ],
  },
];

export function roleById(id: string): Role | undefined {
  return ROLES.find((r) => r.id === id);
}

// ---------- Storage ----------

export type AppStatus = "pending" | "accepted" | "rejected";

export type StoredApplication = {
  appId: string;
  roleId: RoleId;
  roleTitle: string;
  submittedAt: string; // ISO
  status: AppStatus;
  decidedAt?: string;
  // user identity captured from base questions
  name: string;
  discordUsername: string;
  discordUserId: string;
  // every Q→A
  answers: { question: string; answer: string }[];
};

const APPS_KEY = "relosta_applications_v1";
const CLOSED_KEY = "relosta_closed_roles_v1";

import { supabase } from "./supabaseClient";

// If Supabase is configured, mirror remote data into localStorage and subscribe
async function initRemoteSync() {
  if (!supabase) {
    console.warn("Supabase not initialized for sync");
    return;
  }

  console.info("🔄 Starting Supabase sync...");

  try {
    // initial load
    const { data: appsData, error: appsErr } = await supabase
      .from("applications")
      .select("*")
      .order("submitted_at", { ascending: false });
    if (appsErr) {
      console.error("❌ Error loading applications from Supabase:", appsErr);
    } else if (appsData) {
      console.info(`✅ Loaded ${appsData.length} applications from Supabase`);

      const apps = appsData.map((r: any) => ({
        appId: r.app_id,
        roleId: r.role_id,
        roleTitle: r.role_title,
        submittedAt: r.submitted_at,
        status: r.status,
        decidedAt: r.decided_at || undefined,
        name: r.name,
        discordUsername: r.discord_username,
        discordUserId: r.discord_user_id,
        answers: r.answers || [],
      }));
      saveApplications(apps);
    }

    // closed roles
    const { data: closedData, error: closedErr } = await supabase
      .from("closed_roles")
      .select("role_id");
    if (!closedErr && closedData) {
      const ids = closedData.map((r: any) => r.role_id);
      localStorage.setItem(CLOSED_KEY, JSON.stringify(ids));
    }

    // realtime subscriptions
    try {
      // Prefer channel API (Supabase JS v2)
      if ((supabase as any).channel) {
        console.info("📡 Setting up realtime subscriptions (channel API)...");
        const appsChannel = (supabase as any)
          .channel("public:applications")
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "applications" },
            (payload: any) => {
              console.info("🔔 Realtime update received for applications:", payload.eventType);
              const ev = payload.eventType;
              const row = payload.new || payload.old;
              if (!row) return;
              const app: StoredApplication = {
                appId: row.app_id,
                roleId: row.role_id,
                roleTitle: row.role_title,
                submittedAt: row.submitted_at,
                status: row.status,
                decidedAt: row.decided_at || undefined,
                name: row.name,
                discordUsername: row.discord_username,
                discordUserId: row.discord_user_id,
                answers: row.answers || [],
              };
              const all = loadApplications();
              if (ev === "INSERT") {
                all.unshift(app);
              } else if (ev === "UPDATE") {
                const i = all.findIndex((a) => a.appId === app.appId);
                if (i >= 0) all[i] = app;
                else all.unshift(app);
              } else if (ev === "DELETE") {
                const i = all.findIndex((a) => a.appId === app.appId);
                if (i >= 0) all.splice(i, 1);
              }
              saveApplications(all);
            }
          )
          .subscribe();

        const closedChannel = (supabase as any)
          .channel("public:closed_roles")
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "closed_roles" },
            (payload: any) => {
              // rebuild closed list from remote
              (async () => {
                const { data } = await supabase.from("closed_roles").select("role_id");
                if (data) {
                  const ids = data.map((r: any) => r.role_id);
                  localStorage.setItem(CLOSED_KEY, JSON.stringify(ids));
                }
              })();
            }
          )
          .subscribe();

        // keep reference if needed later (not currently used)
      } else {
        console.warn("⚠️ Supabase channel API not available, using legacy realtime API");
        (supabase as any)
          .from("applications")
          .on("*", (payload: any) => {
            console.info("🔔 Realtime update (legacy):", payload);
            const ev = payload.eventType || payload.type;
            const row = payload.new || payload.record || payload.old;
            if (!row) return;
            const app: StoredApplication = {
              appId: row.app_id,
              roleId: row.role_id,
              roleTitle: row.role_title,
              submittedAt: row.submitted_at,
              status: row.status,
              decidedAt: row.decided_at || undefined,
              name: row.name,
              discordUsername: row.discord_username,
              discordUserId: row.discord_user_id,
              answers: row.answers || [],
            };
            const all = loadApplications();
            if (ev === "INSERT") all.unshift(app);
            else if (ev === "UPDATE") {
              const i = all.findIndex((a) => a.appId === app.appId);
              if (i >= 0) all[i] = app;
              else all.unshift(app);
            } else if (ev === "DELETE") {
              const i = all.findIndex((a) => a.appId === app.appId);
              if (i >= 0) all.splice(i, 1);
            }
            saveApplications(all);
          })
          .subscribe();
      }
    } catch (err) {
      console.error("❌ Supabase realtime subscribe failed", err);
    }
  } catch (e) {
    console.error("❌ Supabase sync initialization failed", e);
  }
}

// kick off background sync (don't await)
initRemoteSync();



export function loadApplications(): StoredApplication[] {
  try {
    return JSON.parse(localStorage.getItem(APPS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveApplications(apps: StoredApplication[]) {
  localStorage.setItem(APPS_KEY, JSON.stringify(apps));
}

export function upsertApplication(app: StoredApplication) {
  const all = loadApplications();
  const i = all.findIndex((a) => a.appId === app.appId);
  if (i >= 0) all[i] = app;
  else all.unshift(app);
  saveApplications(all);

  // mirror to Supabase (fire-and-forget)
  if (supabase) {
    (async () => {
      try {
        console.info("📤 Upserting application to Supabase:", app.appId);
        const { error } = await supabase.from("applications").upsert({
          app_id: app.appId,
          role_id: app.roleId,
          role_title: app.roleTitle,
          submitted_at: app.submittedAt,
          status: app.status,
          decided_at: app.decidedAt || null,
          name: app.name,
          discord_username: app.discordUsername,
          discord_user_id: app.discordUserId,
          answers: app.answers,
        });
        if (error) {
          console.error("❌ Supabase upsert failed:", error);
        } else {
          console.info("✅ Application written to Supabase");
        }
      } catch (err) {
        console.error("❌ Failed to write application to Supabase", err);
      }
    })();
  } else {
    console.warn("⚠️ Supabase not initialized, application not sent to Supabase");
  }
}

export function loadClosedRoles(): RoleId[] {
  try {
    return JSON.parse(localStorage.getItem(CLOSED_KEY) || "[]");
  } catch {
    return [];
  }
}

export function setRoleClosed(roleId: RoleId, closed: boolean) {
  const current = new Set(loadClosedRoles());
  if (closed) current.add(roleId);
  else current.delete(roleId);
  localStorage.setItem(CLOSED_KEY, JSON.stringify([...current]));
  if (supabase) {
    (async () => {
      try {
        if (closed) {
          await supabase.from("closed_roles").upsert({ role_id: roleId });
        } else {
          await supabase.from("closed_roles").delete().eq("role_id", roleId);
        }
      } catch (err) {
        console.warn("Failed to sync closed role to Supabase", err);
      }
    })();
  }
}

export function isRoleClosed(roleId: RoleId): boolean {
  return loadClosedRoles().includes(roleId);
}

// 10-char id with letters, digits, and symbols
export function generateAppId(): string {
  const chars =
    "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%&*";
  let out = "";
  const arr = new Uint32Array(10);
  crypto.getRandomValues(arr);
  for (let i = 0; i < 10; i++) out += chars[arr[i] % chars.length];
  return out;
}

// ---------- Webhook ----------

function chunkValue(v: string, max = 1024): string {
  if (v.length <= max) return v || "—";
  return v.slice(0, max - 1) + "…";
}

export async function sendApplicationWebhook(app: StoredApplication) {
  const fields = app.answers.slice(0, 24).map((qa) => ({
    name: chunkValue(qa.question, 256),
    value: chunkValue(qa.answer || "—"),
  }));
  const payload = {
    username: "relosta.in — Jobs",
    embeds: [
      {
        title: `New Application · ${app.roleTitle}`,
        description: `**Application ID:** \`${app.appId}\``,
        color: 5814783,
        fields,
        timestamp: app.submittedAt,
      },
    ],
  };
  const fd = new FormData();
  fd.append("payload_json", JSON.stringify(payload));
  const resp = await fetch(APPLICATIONS_WEBHOOK, { method: "POST", body: fd });
  if (!resp.ok && resp.status !== 204) throw new Error("Webhook failed");
}

export async function sendAcceptanceWebhook(app: StoredApplication) {
  const payload = {
    username: "relosta.in — Jobs",
    embeds: [
      {
        title: `✅ Application Accepted · ${app.roleTitle}`,
        color: 4521796,
        fields: [
          { name: "Application ID", value: `\`${app.appId}\``, inline: false },
          { name: "Name", value: app.name || "—", inline: true },
          { name: "Discord Username", value: app.discordUsername || "—", inline: true },
          { name: "Discord User ID", value: app.discordUserId || "—", inline: true },
        ],
        timestamp: new Date().toISOString(),
      },
    ],
  };
  const fd = new FormData();
  fd.append("payload_json", JSON.stringify(payload));
  const resp = await fetch(APPLICATIONS_WEBHOOK, { method: "POST", body: fd });
  if (!resp.ok && resp.status !== 204) throw new Error("Webhook failed");
}

// ---------- Per-user "my applications" (so they see acceptance) ----------

const MY_APPS_KEY = "relosta_my_app_ids_v1";

export function rememberMyAppId(appId: string) {
  const arr: string[] = JSON.parse(localStorage.getItem(MY_APPS_KEY) || "[]");
  if (!arr.includes(appId)) arr.unshift(appId);
  localStorage.setItem(MY_APPS_KEY, JSON.stringify(arr.slice(0, 20)));
}

export function getMyAppIds(): string[] {
  try {
    return JSON.parse(localStorage.getItem(MY_APPS_KEY) || "[]");
  } catch {
    return [];
  }
}

const SEEN_ACCEPTED_KEY = "relosta_seen_accepted_v1";

export function markAcceptedSeen(appId: string) {
  const arr: string[] = JSON.parse(localStorage.getItem(SEEN_ACCEPTED_KEY) || "[]");
  if (!arr.includes(appId)) arr.push(appId);
  localStorage.setItem(SEEN_ACCEPTED_KEY, JSON.stringify(arr));
}

export function getSeenAccepted(): string[] {
  try {
    return JSON.parse(localStorage.getItem(SEEN_ACCEPTED_KEY) || "[]");
  } catch {
    return [];
  }
}