(function () {
  "use strict";

  const apiUrl = "/api/admin-wishes";
  const dashboardUrl = "./admin-dashboard.html";
  const tokenKey = "wishWallAdminToken";

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    const form = document.getElementById("loginForm");
    const input = document.getElementById("adminToken");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      await login(input.value.trim());
    });
  }

  async function login(token) {
    const button = document.getElementById("loginButton");

    clearError();

    if (!token) {
      showError("请输入管理口令");
      return;
    }

    button.disabled = true;
    button.textContent = "验证中...";

    try {
      await requestJson(`${apiUrl}?verify=true`, token);
      sessionStorage.setItem(tokenKey, token);
      window.location.href = dashboardUrl;
    } catch (error) {
      sessionStorage.removeItem(tokenKey);
      showError(error.message || "管理口令不正确");
      toast("口令错误，未进入后台");
    } finally {
      button.disabled = false;
      button.textContent = "进入后台";
    }
  }

  async function requestJson(url, token) {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`
      }
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || "验证失败");
    }

    return data;
  }

  function showError(message) {
    const errorEl = document.getElementById("loginError");
    errorEl.textContent = message;
    errorEl.classList.add("show");
  }

  function clearError() {
    const errorEl = document.getElementById("loginError");
    errorEl.textContent = "";
    errorEl.classList.remove("show");
  }

  function toast(message) {
    const toastEl = document.getElementById("toast");
    toastEl.textContent = message;
    toastEl.classList.add("show");
    window.clearTimeout(toastEl.timer);
    toastEl.timer = window.setTimeout(() => {
      toastEl.classList.remove("show");
    }, 2200);
  }
})();
