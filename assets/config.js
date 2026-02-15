// Configuration loader for boxXcel application
// Loads config from config.json and provides a global CONFIG object

(function() {
  // Cache for loaded config
  let configCache = null;
  let configPromise = null;
  let isReady = false;

  /**
   * Load configuration from config.json
   * @returns {Promise<Object>} Configuration object
   */
  async function loadConfig() {
    if (configCache) {
      return configCache;
    }

    if (configPromise) {
      return configPromise;
    }

    configPromise = fetch('/config.json', { cache: 'no-store' })
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to load config.json');
        }
        return res.json();
      })
      .then(config => {
        configCache = config;
        configPromise = null;
        isReady = true;
        return config;
      })
      .catch(err => {
        console.error('Error loading config:', err);
        configPromise = null;
        // Return fallback config with default values
        const fallback = {
          apiBase: "https://0v4tvwe5l4.execute-api.eu-west-2.amazonaws.com/prod",
          cognitoDomain: "https://eu-west-2744agx2nc.auth.eu-west-2.amazoncognito.com",
          clientId: "1hhh6m6lhs126argcqac9h93rc",
          redirectUri: "https://www.boxxcel.com/auth/callback.html",
          logoutUri: "https://www.boxxcel.com/"
        };
        configCache = fallback;
        isReady = true;
        return fallback;
      });

    return configPromise;
  }

  /**
   * Get configuration value synchronously (returns null if not loaded)
   * @param {string} key - Configuration key
   * @returns {any} Configuration value or null
   */
  function getConfigSync(key) {
    if (!configCache) {
      console.warn('Config not loaded yet. Use getConfig() or ensure config is loaded first.');
      return null;
    }
    return configCache[key];
  }

  /**
   * Get configuration value asynchronously (loads config if needed)
   * @param {string} key - Configuration key (optional - returns entire config if omitted)
   * @returns {Promise<any>} Configuration value or entire config
   */
  async function getConfig(key) {
    const config = await loadConfig();
    return key ? config[key] : config;
  }

  /**
   * Wait for config to be loaded and ready
   * @returns {Promise<Object>} Configuration object
   */
  async function ready() {
    return loadConfig();
  }

  // Export global CONFIG object
  window.CONFIG = {
    load: loadConfig,
    get: getConfig,
    getSync: getConfigSync,
    ready: ready,
    isReady: () => isReady
  };

  // Auto-load config on script load
  loadConfig();
})();
