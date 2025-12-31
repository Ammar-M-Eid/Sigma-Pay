package com.sigmapay.tests;

import com.sigmapay.config.ConfigManager;
import com.sigmapay.pages.DashboardPage;
import com.sigmapay.pages.LoginPage;
import org.testng.annotations.Test;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Authentication Test Cases
 */
public class AuthenticationTests extends BaseTest {
    
    @Test(priority = 1, groups = {"smoke", "regression"})
    public void testLoginWithValidCredentials() {
        logger.info("Test: Login with valid credentials");
        ConfigManager config = ConfigManager.getInstance();
        
        LoginPage loginPage = new LoginPage();
        loginPage.openLoginPage();
        
        assertThat(loginPage.isLoginPageDisplayed())
                .as("Login page should be displayed")
                .isTrue();
        
        DashboardPage dashboardPage = loginPage.login(
                config.getTestUserEmail(),
                config.getTestUserPassword()
        );
        
        assertThat(dashboardPage.isDashboardDisplayed())
                .as("Dashboard should be displayed after successful login")
                .isTrue();
    }
    
    @Test(priority = 2, groups = {"regression"})
    public void testLoginPageElements() {
        logger.info("Test: Verify login page elements");
        
        LoginPage loginPage = new LoginPage();
        loginPage.openLoginPage();
        
        assertThat(loginPage.isLoginPageDisplayed())
                .as("Login page elements should be visible")
                .isTrue();
        
        assertThat(loginPage.getPageTitle())
                .as("Page title should contain 'SigmaPay'")
                .containsIgnoringCase("SigmaPay");
        
        assertThat(loginPage.isSignInButtonEnabled())
                .as("Sign in button should be enabled")
                .isTrue();
    }
    
    @Test(priority = 3, groups = {"regression"})
    public void testNavigationToRegistration() {
        logger.info("Test: Navigate to registration page");
        
        LoginPage loginPage = new LoginPage();
        loginPage.openLoginPage();
        
        loginPage.clickCreateAccount();
        
        // Note: Would validate registration page elements here
    }
    
    @Test(priority = 4, groups = {"smoke", "regression"})
    public void testLogout() {
        logger.info("Test: User logout");
        ConfigManager config = ConfigManager.getInstance();
        
        LoginPage loginPage = new LoginPage();
        loginPage.openLoginPage();
        
        DashboardPage dashboardPage = loginPage.login(
                config.getTestUserEmail(),
                config.getTestUserPassword()
        );
        
        assertThat(dashboardPage.isDashboardDisplayed())
                .as("Dashboard should be displayed")
                .isTrue();
        
        LoginPage loggedOutPage = dashboardPage.logout();
        
        assertThat(loggedOutPage.isLoginPageDisplayed())
                .as("Should be redirected to login page after logout")
                .isTrue();
    }
}
