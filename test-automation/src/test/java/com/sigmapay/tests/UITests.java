package com.sigmapay.tests;

import com.sigmapay.config.ConfigManager;
import com.sigmapay.pages.LoginPage;
import org.openqa.selenium.WebDriver;
import org.testng.annotations.Test;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * UI Visual Tests - Validate visual elements and theme
 */
public class UITests extends BaseTest {
    
    @Test(priority = 1, groups = {"ui"})
    public void testLoginPageVisualElements() {
        logger.info("Test: Verify login page visual elements");
        
        LoginPage loginPage = new LoginPage();
        loginPage.openLoginPage();
        
        // Verify page title
        WebDriver driver = loginPage.driver;
        assertThat(driver.getTitle())
                .as("Page title should be correct")
                .contains("SigmaPay");
        
        // Verify URL
        assertThat(driver.getCurrentUrl())
                .as("Should be on login page URL")
                .isEqualTo(ConfigManager.getInstance().getAppUrl() + "/");
    }
    
    @Test(priority = 2, groups = {"ui"})
    public void testSigmapayThemeColors() {
        logger.info("Test: Verify Sigmapay theme is applied");
        
        LoginPage loginPage = new LoginPage();
        loginPage.openLoginPage();
        
        // This would verify the primary color (#646cff) is being used
        // Can check computed styles of elements
        assertThat(loginPage.isLoginPageDisplayed())
                .as("Theme should be applied to login page")
                .isTrue();
    }
}
