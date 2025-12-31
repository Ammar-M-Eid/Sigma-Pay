package com.sigmapay.pages;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

/**
 * Group Savings Page Object Model
 */
public class GroupSavingsPage extends BasePage {
    
    @FindBy(css = "input[name='groupName'], input[placeholder*='group']")
    private WebElement groupNameInput;
    
    @FindBy(css = "input[name='members'], textarea[placeholder*='members']")
    private WebElement membersInput;
    
    @FindBy(xpath = "//button[contains(text(), 'Create Group')]")
    private WebElement createGroupButton;
    
    @FindBy(css = "h1, h2")
    private WebElement pageHeading;
    
    // Constructor
    public GroupSavingsPage() {
        super();
    }
    
    // Page Actions
    public GroupSavingsPage enterGroupName(String groupName) {
        sendKeys(groupNameInput, groupName);
        return this;
    }
    
    public GroupSavingsPage enterMembers(String members) {
        sendKeys(membersInput, members);
        return this;
    }
    
    public GroupSavingsPage clickCreateGroup() {
        click(createGroupButton);
        return this;
    }
    
    public GroupSavingsPage createGroup(String groupName, String members) {
        enterGroupName(groupName);
        enterMembers(members);
        clickCreateGroup();
        return this;
    }
    
    // Validation methods
    public boolean isGroupSavingsPageDisplayed() {
        return isElementDisplayed(groupNameInput) && 
               isElementDisplayed(createGroupButton);
    }
    
    public String getPageHeading() {
        return getText(pageHeading);
    }
}
