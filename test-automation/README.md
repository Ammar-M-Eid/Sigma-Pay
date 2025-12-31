# SigmaPay Test Automation Framework

## Overview

Comprehensive Selenium + TestNG test automation framework for the SigmaPay Personal Finance Management System. This framework provides end-to-end automated testing with robust Page Object Model architecture, detailed reporting, and CI/CD integration capabilities.

## 🏗️ Framework Architecture

```
test-automation/
├── src/
│   ├── test/
│   │   ├── java/com/sigmapay/
│   │   │   ├── config/          # Configuration management
│   │   │   │   ├── ConfigManager.java
│   │   │   │   └── DriverFactory.java
│   │   │   ├── pages/           # Page Object Models
│   │   │   │   ├── BasePage.java
│   │   │   │   ├── LoginPage.java
│   │   │   │   ├── DashboardPage.java
│   │   │   │   ├── BudgetPage.java
│   │   │   │   ├── GoalsPage.java
│   │   │   │   ├── PaymentsPage.java
│   │   │   │   ├── ReportsPage.java
│   │   │   │   ├── ProfilePage.java
│   │   │   │   ├── GroupSavingsPage.java
│   │   │   │   └── NotificationsPage.java
│   │   │   ├── tests/           # Test classes
│   │   │   │   ├── BaseTest.java
│   │   │   │   ├── AuthenticationTests.java
│   │   │   │   ├── BudgetTests.java
│   │   │   │   ├── GoalsTests.java
│   │   │   │   ├── AllPagesTests.java
│   │   │   │   └── UITests.java
│   │   │   ├── listeners/       # TestNG listeners
│   │   │   │   ├── TestListener.java
│   │   │   │   └── ExtentReportListener.java
│   │   │   └── utils/           # Utility classes
│   │   │       └── ScreenshotUtil.java
│   │   └── resources/
│   │       ├── testng.xml       # TestNG suite configuration
│   │       └── config.properties # Test configuration
│   └── main/java/               # Additional utilities (optional)
├── test-reports/                # Generated test reports
├── pom.xml                      # Maven dependencies
└── README.md                    # This file
```

## ✨ Key Features

- **Page Object Model (POM):** Clean separation of page structure and test logic
- **TestNG Framework:** Advanced test management with parallel execution support
- **Selenium WebDriver:** Cross-browser automation (Chrome, Firefox, Edge)
- **ExtentReports:** Rich HTML reports with screenshots and execution details
- **WebDriverManager:** Automatic browser driver management
- **Parallel Execution:** Run tests in parallel for faster execution
- **Configurable:** Easy configuration through properties file
- **Screenshot on Failure:** Automatic screenshot capture for failed tests
- **CI/CD Ready:** Maven-based project ready for Jenkins/GitHub Actions
- **Comprehensive Logging:** SLF4J logging for debugging

## 🚀 Getting Started

### Prerequisites

- **Java 11 or higher**
- **Maven 3.6+**
- **Chrome/Firefox/Edge browser** installed
- **SigmaPay application** running (frontend + backend)

### Installation

1. **Clone the repository** (if not already done):
   ```bash
   cd test-automation
   ```

2. **Install dependencies**:
   ```bash
   mvn clean install -DskipTests
   ```

3. **Start SigmaPay application**:
   ```bash
   # Terminal 1 - Backend
   cd ../backend-server
   npm install
   npm start

   # Terminal 2 - Frontend
   cd ../frontend-client
   npm install
   npm start
   ```

4. **Verify configuration** in `src/test/resources/config.properties`:
   ```properties
   app.url=http://localhost:3000
   app.backend.url=http://localhost:3001
   browser=chrome
   headless=false
   ```

## 🧪 Running Tests

### Run All Tests
```bash
mvn clean test
```

### Run Specific Test Suite
```bash
# Smoke tests only
mvn clean test -Dgroups="smoke"

# Regression tests only
mvn clean test -Dgroups="regression"

# UI tests only
mvn clean test -Dgroups="ui"
```

### Run Specific Test Class
```bash
mvn clean test -Dtest=AuthenticationTests
mvn clean test -Dtest=BudgetTests
mvn clean test -Dtest=GoalsTests
```

### Run with Different Browser
```bash
# Chrome (default)
mvn clean test -Dbrowser=chrome

# Firefox
mvn clean test -P firefox

# Edge
mvn clean test -P edge

# Headless Chrome
mvn clean test -P headless
```

### Run with Custom Configuration
```bash
mvn clean test \
  -Dapp.url=http://staging.sigmapay.com \
  -Dbrowser=firefox \
  -Dheadless=true
```

## 📊 Test Reports

After test execution, reports are generated in the `test-reports/` directory:

### ExtentReports
- **Location:** `test-reports/SigmaPay_Test_Report.html`
- **Features:**
  - Test execution summary
  - Pass/Fail statistics
  - Screenshots for failed tests
  - Execution timeline
  - Environment information

### View Reports
```bash
# Open in default browser (macOS)
open test-reports/SigmaPay_Test_Report.html

# Open in default browser (Linux)
xdg-open test-reports/SigmaPay_Test_Report.html

# Open in default browser (Windows)
start test-reports/SigmaPay_Test_Report.html
```

## 📝 Test Coverage

### Current Test Coverage

| Module | Test Cases | Status |
|--------|------------|---------|
| **Authentication** | 4 | ✅ Complete |
| **Budget Management** | 3 | ✅ Complete |
| **Financial Goals** | 3 | ✅ Complete |
| **Payments** | 1 | ✅ Complete |
| **Reports** | 1 | ✅ Complete |
| **Profile** | 1 | ✅ Complete |
| **Group Savings** | 1 | ✅ Complete |
| **Notifications** | 1 | ✅ Complete |
| **UI/Visual** | 2 | ✅ Complete |
| **Total** | **17** | ✅ Complete |

### Test Scenarios

#### Authentication Tests
- ✅ Login with valid credentials
- ✅ Verify login page elements
- ✅ Navigate to registration page
- ✅ User logout

#### Budget Tests
- ✅ Verify budget page display
- ✅ Verify budget creation form
- ✅ Create new budget

#### Goals Tests
- ✅ Verify goals page display
- ✅ Verify goal creation form
- ✅ Create new financial goal

#### All Pages Tests
- ✅ Verify all page navigations
- ✅ Verify page displays for all modules

#### UI Tests
- ✅ Verify login page visual elements
- ✅ Verify Sigmapay theme colors

## 🔧 Configuration

### config.properties

```properties
# Application URLs
app.url=http://localhost:3000
app.backend.url=http://localhost:3001

# Browser Configuration
browser=chrome                  # Options: chrome, firefox, edge
headless=false                  # Run in headless mode
implicit.wait=10                # Implicit wait in seconds
explicit.wait=20                # Explicit wait in seconds
page.load.timeout=30            # Page load timeout in seconds

# Test Data
test.user.email=test@example.com
test.user.password=password123
test.user.username=testuser

# Reporting
reports.directory=test-reports
screenshots.directory=test-reports/screenshots
extent.report.name=SigmaPay_Test_Report.html
```

### testng.xml

Configure test suites, parallel execution, and test groups:

```xml
<suite name="SigmaPay Test Suite" parallel="classes" thread-count="3">
    <test name="Smoke Tests">
        <groups>
            <run>
                <include name="smoke"/>
            </run>
        </groups>
        <classes>
            <class name="com.sigmapay.tests.AuthenticationTests"/>
            <class name="com.sigmapay.tests.BudgetTests"/>
        </classes>
    </test>
</suite>
```

## 🏗️ Framework Design Patterns

### 1. Page Object Model (POM)
- Each page is represented by a separate class
- Page elements are defined using @FindBy annotations
- Page actions are encapsulated in methods
- Promotes code reusability and maintainability

### 2. Factory Pattern
- `DriverFactory` creates and manages WebDriver instances
- Supports multiple browsers with configuration

### 3. Singleton Pattern
- `ConfigManager` ensures single instance of configuration
- Thread-safe implementation

### 4. Fluent Interface
- Method chaining for readable test code
- Example: `loginPage.enterEmail(email).enterPassword(pwd).clickSignIn()`

## 📚 Adding New Tests

### Step 1: Create Page Object (if needed)

```java
package com.sigmapay.pages;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

public class NewPage extends BasePage {
    
    @FindBy(css = "#element-id")
    private WebElement element;
    
    public NewPage() {
        super();
    }
    
    public NewPage performAction() {
        click(element);
        return this;
    }
    
    public boolean isPageDisplayed() {
        return isElementDisplayed(element);
    }
}
```

### Step 2: Create Test Class

```java
package com.sigmapay.tests;

import org.testng.annotations.Test;
import static org.assertj.core.api.Assertions.assertThat;

public class NewTests extends BaseTest {
    
    @Test(groups = {"regression"})
    public void testNewFeature() {
        // Arrange
        NewPage page = new NewPage();
        
        // Act
        page.performAction();
        
        // Assert
        assertThat(page.isPageDisplayed()).isTrue();
    }
}
```

### Step 3: Add to testng.xml

```xml
<class name="com.sigmapay.tests.NewTests"/>
```

## 🐛 Debugging

### Enable Verbose Logging

Edit `src/test/resources/logback.xml`:
```xml
<logger name="com.sigmapay" level="DEBUG"/>
```

### Run Single Test with Debug
```bash
mvn clean test -Dtest=AuthenticationTests#testLoginWithValidCredentials -X
```

### View Screenshots
Failed test screenshots are automatically saved to:
```
test-reports/screenshots/[test-name]_[timestamp].png
```

## 📦 Dependencies

### Core Dependencies
- **Selenium WebDriver 4.15.0** - Browser automation
- **TestNG 7.8.0** - Test framework
- **WebDriverManager 5.6.2** - Automatic driver management
- **ExtentReports 5.1.1** - Test reporting
- **AssertJ 3.24.2** - Fluent assertions
- **SLF4J/Logback** - Logging framework

## 🔄 CI/CD Integration

### Jenkins Pipeline Example

```groovy
pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/Ammar-M-Eid/SigmaPay-light.git'
            }
        }
        
        stage('Build') {
            steps {
                dir('test-automation') {
                    sh 'mvn clean compile'
                }
            }
        }
        
        stage('Run Tests') {
            steps {
                dir('test-automation') {
                    sh 'mvn clean test -Dheadless=true'
                }
            }
        }
        
        stage('Publish Reports') {
            steps {
                publishHTML([
                    reportDir: 'test-automation/test-reports',
                    reportFiles: 'SigmaPay_Test_Report.html',
                    reportName: 'Test Report'
                ])
            }
        }
    }
}
```

### GitHub Actions Example

```yaml
name: Selenium Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up JDK 11
      uses: actions/setup-java@v3
      with:
        java-version: '11'
        distribution: 'temurin'
    
    - name: Run tests
      run: |
        cd test-automation
        mvn clean test -Dheadless=true
    
    - name: Upload test report
      uses: actions/upload-artifact@v3
      with:
        name: test-report
        path: test-automation/test-reports/
```

## 🤝 Contributing

### Code Standards
- Follow Java naming conventions
- Add JavaDoc comments to classes and methods
- Keep methods small and focused
- Write descriptive test names
- Use AssertJ for assertions

### Pull Request Process
1. Create feature branch
2. Add tests for new functionality
3. Ensure all tests pass
4. Update documentation
5. Submit pull request

## 📞 Support

For issues or questions:
- Create an issue in the GitHub repository
- Contact: Ammar-M-Eid

## 📄 License

This project is part of the SigmaPay application.

---

**Happy Testing! 🎉**
