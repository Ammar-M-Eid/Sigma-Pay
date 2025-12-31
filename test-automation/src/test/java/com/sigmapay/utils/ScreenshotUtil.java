package com.sigmapay.utils;

import com.sigmapay.config.ConfigManager;
import com.sigmapay.config.DriverFactory;
import org.apache.commons.io.FileUtils;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Utility class for capturing screenshots
 */
public class ScreenshotUtil {
    
    public static String captureScreenshot(String testName) throws IOException {
        ConfigManager config = ConfigManager.getInstance();
        WebDriver driver = DriverFactory.getDriver();
        
        // Create screenshots directory if it doesn't exist
        File screenshotsDir = new File(config.getScreenshotsDirectory());
        if (!screenshotsDir.exists()) {
            screenshotsDir.mkdirs();
        }
        
        // Generate filename with timestamp
        String timestamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
        String fileName = testName + "_" + timestamp + ".png";
        String filePath = config.getScreenshotsDirectory() + "/" + fileName;
        
        // Capture screenshot
        TakesScreenshot screenshot = (TakesScreenshot) driver;
        File srcFile = screenshot.getScreenshotAs(OutputType.FILE);
        File destFile = new File(filePath);
        
        FileUtils.copyFile(srcFile, destFile);
        
        return filePath;
    }
}
