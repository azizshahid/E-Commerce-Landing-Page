document.body.classList.add("loaded");

let currentTab = "signin";

// ── Tab switch ──────────────────────────────────────────────

function switchTab(tab) {
  currentTab = tab;
  const isRegister = tab === "register";

  document.getElementById("signinTab").classList.toggle("active", !isRegister);
  document.getElementById("registerTab").classList.toggle("active", isRegister);

  // Panel title
  document.getElementById("panelTitle").textContent = isRegister
    ? "Create your account"
    : "Welcome back";
  document.getElementById("panelSub").textContent = isRegister
    ? "Join the Artisan community"
    : "Sign in to your Artisan account";

  // Show/hide fields
  document.getElementById("nameFields").classList.toggle("show", isRegister);
  document.getElementById("passwordHint").classList.toggle("show", isRegister);
  document.getElementById("strengthWrap").classList.toggle("show", isRegister);
  document
    .getElementById("confirmPwField")
    .classList.toggle("show", isRegister);
  document
    .getElementById("marketingField")
    .classList.toggle("show", isRegister);
  document.getElementById("signinMeta").style.display = isRegister
    ? "none"
    : "flex";

  // Button + switch prompt
  document.getElementById("submitLabel").innerHTML = isRegister
    ? '<i class="ri-user-add-line"></i> Create account'
    : '<i class="ri-login-circle-line"></i> Sign in';

  document.getElementById("switchPrompt").innerHTML = isRegister
    ? "Already have an account? <a onclick=\"switchTab('signin')\">Sign in</a>"
    : "Don't have an account? <a onclick=\"switchTab('register')\">Create one</a>";

  // Update autocomplete
  document.getElementById("authPassword").autocomplete = isRegister
    ? "new-password"
    : "current-password";

  hideError();
}

// ── Form submit ─────────────────────────────────────────────

function handleSubmit(e) {
  e.preventDefault();
  hideError();

  const email = document.getElementById("authEmail").value.trim();
  const pw = document.getElementById("authPassword").value;

  if (!email || !pw) {
    showError("Please fill in all fields.");
    return;
  }
  if (pw.length < 8) {
    showError("Password must be at least 8 characters.");
    return;
  }

  if (currentTab === "register") {
    const confirm = document.getElementById("confirmPassword").value;
    if (pw !== confirm) {
      showError("Passwords do not match.");
      return;
    }
  }

  // Loading state
  const btn = document.getElementById("submitBtn");
  btn.classList.add("loading");

  setTimeout(() => {
    btn.classList.remove("loading");
    document.getElementById("authForm").style.display = "none";
    document.getElementById("authSuccess").classList.add("show");
    document.getElementById("successTitle").textContent =
      currentTab === "register" ? "Account created!" : "Signed in!";
    document.getElementById("successSub").textContent =
      currentTab === "register"
        ? "Welcome to the Artisan community."
        : "Redirecting you to your account…";

    // Auto redirect after 2s
    setTimeout(() => {
      location.href = "./account.html";
    }, 2500);
  }, 1600);
}

// ── Social auth ─────────────────────────────────────────────

function socialAuth(provider) {
  const btn = event.currentTarget;
  btn.textContent = `Connecting to ${provider}…`;
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = `Continue with ${provider}`;
    btn.disabled = false;
    showError(`${provider} auth is not connected in this demo.`);
  }, 1200);
}

// ── Password helpers ────────────────────────────────────────

function togglePassword() {
  const inp = document.getElementById("authPassword");
  const icon = document.getElementById("pwEyeIcon");
  if (inp.type === "password") {
    inp.type = "text";
    icon.className = "ri-eye-line";
  } else {
    inp.type = "password";
    icon.className = "ri-eye-off-line";
  }
}

function toggleConfirm() {
  const inp = document.getElementById("confirmPassword");
  const icon = document.getElementById("confirmEyeIcon");
  if (inp.type === "password") {
    inp.type = "text";
    icon.className = "ri-eye-line";
  } else {
    inp.type = "password";
    icon.className = "ri-eye-off-line";
  }
}

function checkStrength(input) {
  if (currentTab !== "register") return;
  const v = input.value;
  let score = 0;
  if (v.length >= 8) score++;
  if (/[A-Z]/.test(v)) score++;
  if (/[0-9]/.test(v)) score++;
  if (/[^A-Za-z0-9]/.test(v)) score++;

  const fill = document.getElementById("strengthFill");
  const label = document.getElementById("strengthLabel");
  const pct = ["0%", "25%", "50%", "75%", "100%"][score];
  const clr = ["", "#e24b4b", "#ef9f27", "#63b360", "#2d6e32"][score];
  const txt = ["", "Weak", "Fair", "Good", "Strong"][score];

  fill.style.width = pct;
  fill.style.background = clr;
  label.textContent = v.length ? txt : "";
  label.style.color = clr;
}

function checkMatch(input) {
  const pw = document.getElementById("authPassword").value;
  const label = document.getElementById("matchLabel");
  if (!input.value) {
    label.textContent = "";
    return;
  }
  if (input.value === pw) {
    label.textContent = "✓ Passwords match";
    label.style.color = "#5a9e5d";
  } else {
    label.textContent = "✗ Passwords do not match";
    label.style.color = "#c0504d";
  }
}

// ── Error helpers ───────────────────────────────────────────

function showError(msg) {
  document.getElementById("authErrorMsg").textContent = msg;
  document.getElementById("authError").classList.add("show");
}

function hideError() {
  document.getElementById("authError").classList.remove("show");
}

// ── Forgot password ─────────────────────────────────────────

function showForgot() {
  document.getElementById("mainPanel").style.display = "none";
  document.getElementById("forgotPanel").classList.add("show");
}

function hideForgot() {
  document.getElementById("mainPanel").style.display = "block";
  document.getElementById("forgotPanel").classList.remove("show");
}

function sendReset() {
  const email = document.getElementById("resetEmail").value.trim();
  if (!email) return;
  const btn = document.getElementById("resetBtn");
  btn.classList.add("loading");
  setTimeout(() => {
    btn.classList.remove("loading");
    document.getElementById("resetEmailDisplay").textContent = email;
    document.getElementById("resetSuccess").style.display = "block";
    btn.style.display = "none";
  }, 1400);
}

// Read URL param: ?mode=register
const p = new URLSearchParams(window.location.search);
if (p.get("mode") === "register") switchTab("register");
