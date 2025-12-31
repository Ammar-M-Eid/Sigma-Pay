package com.sigmapay.tests;

import com.sigmapay.config.ConfigManager;
import com.sigmapay.pages.*;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Additional Test Cases for Payments, Reports, Profile, Groups, Notifications
 */
public class PaymentsTests extends BaseTest {
    private PaymentsPage paymentsPage;
    
    @BeforeMethod(groups = {"regression"})
    public void setup() {
        ConfigManager config = ConfigManager.getInstance();
        LoginPage loginPage = new LoginPage();
        loginPage.openLoginPage();
        DashboardPage dashboardPage = loginPage.login(config.getTestUserEmail(), config.getTestUserPassword());
        paymentsPage = dashboardPage.navigateToPayments();
    }
    
    @Test(priority = 1, groups = {"regression"})
    public void testPaymentsPageDisplay() {
        assertThat(paymentsPage.isPaymentsPageDisplayed()).isTrue();
    }
}

class ReportsTests extends BaseTest {
    private ReportsPage reportsPage;
    
    @BeforeMethod(groups = {"regression"})
    public void setup() {
        ConfigManager config = ConfigManager.getInstance();
        LoginPage loginPage = new LoginPage();
        loginPage.openLoginPage();
        DashboardPage dashboardPage = loginPage.login(config.getTestUserEmail(), config.getTestUserPassword());
        reportsPage = dashboardPage.navigateToReports();
    }
    
    @Test(priority = 1, groups = {"regression"})
    public void testReportsPageDisplay() {
        assertThat(reportsPage.isReportsPageDisplayed()).isTrue();
    }
}

class ProfileTests extends BaseTest {
    private ProfilePage profilePage;
    
    @BeforeMethod(groups = {"regression"})
    public void setup() {
        ConfigManager config = ConfigManager.getInstance();
        LoginPage loginPage = new LoginPage();
        loginPage.openLoginPage();
        DashboardPage dashboardPage = loginPage.login(config.getTestUserEmail(), config.getTestUserPassword());
        profilePage = dashboardPage.navigateToProfile();
    }
    
    @Test(priority = 1, groups = {"regression"})
    public void testProfilePageDisplay() {
        assertThat(profilePage.isProfilePageDisplayed()).isTrue();
    }
}

class GroupSavingsTests extends BaseTest {
    private GroupSavingsPage groupSavingsPage;
    
    @BeforeMethod(groups = {"regression"})
    public void setup() {
        ConfigManager config = ConfigManager.getInstance();
        LoginPage loginPage = new LoginPage();
        loginPage.openLoginPage();
        DashboardPage dashboardPage = loginPage.login(config.getTestUserEmail(), config.getTestUserPassword());
        groupSavingsPage = dashboardPage.navigateToGroups();
    }
    
    @Test(priority = 1, groups = {"regression"})
    public void testGroupSavingsPageDisplay() {
        assertThat(groupSavingsPage.isGroupSavingsPageDisplayed()).isTrue();
    }
}

class NotificationsTests extends BaseTest {
    private NotificationsPage notificationsPage;
    
    @BeforeMethod(groups = {"regression"})
    public void setup() {
        ConfigManager config = ConfigManager.getInstance();
        LoginPage loginPage = new LoginPage();
        loginPage.openLoginPage();
        DashboardPage dashboardPage = loginPage.login(config.getTestUserEmail(), config.getTestUserPassword());
        notificationsPage = dashboardPage.navigateToAlerts();
    }
    
    @Test(priority = 1, groups = {"regression"})
    public void testNotificationsPageDisplay() {
        assertThat(notificationsPage.isNotificationsPageDisplayed()).isTrue();
    }
}
