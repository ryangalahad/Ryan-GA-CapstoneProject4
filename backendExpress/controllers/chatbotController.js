// Simple menu-driven chatbot controller
// Provides predefined Q&A responses — role-aware via req.userRole from auth middleware

const menuOptions = {
  message:
    "👋 Hi there! I'm your Compliance Assistant. How can I help you today?\n\nPlease choose an option:",
  options: [
    { key: "1", label: "How to use the app" },
    { key: "2", label: "What is my current role / status?" },
    { key: "3", label: "Case statistics (pending & flagged)" },
    { key: "4", label: "Total registered users" },
    { key: "5", label: "Contact support" },
  ],
};

// Build role-specific response for option 1
function howToUse(role) {
  if (role === "manager") {
    return {
      message:
        "📖 **How to use the app (Manager)**\n\n" +
        "1. Log in with your manager credentials.\n" +
        "2. View the Dashboard to see all pending and flagged cases.\n" +
        "3. Use Search to look up entities against the sanctions watchlist.\n" +
        "4. Review flagged cases submitted by officers.\n" +
        "5. Approve, reassign, or escalate cases as needed.\n" +
        "6. Access History to view cleared cases.",
      options: [{ key: "menu", label: "Back to main menu" }],
    };
  }
  return {
    message:
      "📖 **How to use the app (Officer)**\n\n" +
      "1. Log in with your officer credentials.\n" +
      "2. Navigate to Search to look up individuals against the watchlist.\n" +
      "3. Add suspicious matches to your Cases list.\n" +
      "4. Set the appropriate flag level (1–5) for each case.\n" +
      "5. Submit flagged cases for manager review.\n" +
      "6. Track resolved cases in History.",
    options: [{ key: "menu", label: "Back to main menu" }],
  };
}

// Build role-specific response for option 2
function currentRole(role) {
  if (role === "manager") {
    return {
      message:
        "🔑 **Your Current Role: Manager**\n\n" +
        "As a Manager you can:\n" +
        "• View all cases across all officers\n" +
        "• Approve or escalate flagged cases\n" +
        "• Reassign cases between officers\n" +
        "• Manage user accounts",
      options: [{ key: "menu", label: "Back to main menu" }],
    };
  }
  return {
    message:
      "🔑 **Your Current Role: Officer**\n\n" +
      "As an Officer you can:\n" +
      "• Search the sanctions watchlist\n" +
      "• Create and manage your own cases\n" +
      "• Flag suspicious entries for manager review\n" +
      "• View your case history",
    options: [{ key: "menu", label: "Back to main menu" }],
  };
}

const staticResponses = {
  "3": {
    message:
      "📊 **Case Statistics**\n\n" +
      "Here is the current overview of compliance cases:\n\n" +
      "| Status   | Count  |\n" +
      "|----------|--------|\n" +
      "| Pending  | 1,250  |\n" +
      "| Flagged  | 340    |\n" +
      "| Resolved | 8,410  |\n\n" +
      "Total active cases: **1,590** (Pending + Flagged)",
    options: [{ key: "menu", label: "Back to main menu" }],
  },
  "4": {
    message:
      "👥 **Total Registered Users**\n\n" +
      "The platform currently has **100,000** registered users across all departments.",
    options: [{ key: "menu", label: "Back to main menu" }],
  },
  "5": {
    message:
      "📧 **Contact Support**\n\n" +
      "If you need further assistance, reach out to us:\n\n" +
      "• Email: support@complianceapp.com\n" +
      "• Internal Ticket System: https://helpdesk.internal\n" +
      "• Office Hours: Mon–Fri, 9 AM – 6 PM (SGT)",
    options: [{ key: "menu", label: "Back to main menu" }],
  },
};

export function handleChatMessage(req, res) {
  const { message } = req.body;
  const input = (message || "").trim().toLowerCase();
  const role = req.userRole || "officer"; // from checkAuth middleware

  // Main menu for greetings, "menu", or empty input
  if (
    !input ||
    input === "menu" ||
    input === "hi" ||
    input === "hello" ||
    input === "start"
  ) {
    return res.json(menuOptions);
  }

  // Role-aware responses
  if (input === "1") return res.json(howToUse(role));
  if (input === "2") return res.json(currentRole(role));

  // Static responses
  if (staticResponses[input]) {
    return res.json(staticResponses[input]);
  }

  // Fallback
  return res.json({
    message:
      "🤔 Sorry, I didn't understand that. Please choose one of the options below.",
    options: menuOptions.options,
  });
}
