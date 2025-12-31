package com.sigmapay.config;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

/**
 * Configuration Manager for loading and managing test configuration
 */
public class ConfigManager {
    private static ConfigManager instance;
    private Properties properties;
    
    private ConfigManager() {
        properties = new Properties();
        loadProperties();
    }
    
    public static ConfigManager getInstance() {
        if (instance == null) {
            synchronized (ConfigManager.class) {
                if (instance == null) {
                    instance = new ConfigManager();
                }
            }
        }
        return instance;
    }
    
    private void loadProperties() {
        try {
            String configPath = "src/test/resources/config.properties";
            FileInputStream fis = new FileInputStream(configPath);
            properties.load(fis);
            fis.close();
        } catch (IOException e) {
            throw new RuntimeException("Failed to load configuration: " + e.getMessage());
        }
    }
    
    public String getProperty(String key) {
        String value = System.getProperty(key);
        if (value == null) {
            value = properties.getProperty(key);
        }
        return value;
    }
    
    public String getAppUrl() {
        return getProperty("app.url");
    }
    
    public String getBackendUrl() {
        return getProperty("app.backend.url");
    }
    
    public String getBrowser() {
        return getProperty("browser");
    }
    
    public boolean isHeadless() {
        return Boolean.parseBoolean(getProperty("headless"));
    }
    
    public int getImplicitWait() {
        return Integer.parseInt(getProperty("implicit.wait"));
    }
    
    public int getExplicitWait() {
        return Integer.parseInt(getProperty("explicit.wait"));
    }
    
    public int getPageLoadTimeout() {
        return Integer.parseInt(getProperty("page.load.timeout"));
    }
    
    public String getTestUserEmail() {
        return getProperty("test.user.email");
    }
    
    public String getTestUserPassword() {
        return getProperty("test.user.password");
    }
    
    public String getTestUserUsername() {
        return getProperty("test.user.username");
    }
    
    public String getReportsDirectory() {
        return getProperty("reports.directory");
    }
    
    public String getScreenshotsDirectory() {
        return getProperty("screenshots.directory");
    }
    
    public String getExtentReportName() {
        return getProperty("extent.report.name");
    }
}
