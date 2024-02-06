const { Builder, By, until } = require('selenium-webdriver');

async function testHoverOnMobile() {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        await driver.manage().window().setRect({ width: 375, height: 667 });
        await driver.get('https://skleptest.pl/');

        let elements = await driver.findElements(By.css('button, a'));

        for (let element of elements) {
            try {
                let elementInfo = `Element: ${await element.getTagName()}, Class: ${await element.getAttribute('class')}, Text: ${await element.getText()}`;
                console.log(elementInfo);

                await driver.actions({ bridge: true }).move({ origin: element }).perform();

                let isHovered = await driver.executeScript(
                    "return window.getComputedStyle(arguments[0]).getPropertyValue('color') !== window.getComputedStyle(document.body).getPropertyValue('color')",
                    element
                );
                console.log(`Hovered: ${isHovered}`);
            } catch (error) {
                console.error(`Error: ${error}`);
            }
        }
    } finally {
        await driver.quit();
    }
}

async function testCommentForm() {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        await driver.get('https://skleptest.pl/best-fabrics-dream-dress-dare-try/');
        const testCases = [
            { comment: 'Another comment', author: 'Test Author', email: 'invalid-email', url: 'qwerty' },
            { comment: 'Anotheasdasdr comment', author: 'Testioe Author', email: 'valid-email@gmail.com', url: 'qwerty' },
            { comment: 'Testowy coome lerw ', author: 'userName', email: 'valid@example.com', url: 'https://example.com' },
            { comment: '@@@@@@@@@@@@@@@@@@', author: 'фывыфв', email: 'фывфыв@example.com', url: '123' },
            { comment: 'фывфыввыфом', author: '518231', email: 'фыв@ф123ыв....@example.com', url: '.com' },
            { comment: '123123123123', author: '', email: '        @     .com', url: '' },
            { comment: 'test comment 1', author: 'testUser1', email: 'testUser1@gmail.com', url: '' },
            { comment: 'qqqq', author: 'asdqweasd', email: 'q@qweqweqweqweqwe.com', url: '' },
            { comment: 'تجربة تعليق', author: 'مستخدم_اختبار', email: 'testarabic@test.com', url: '' },
            { comment: '测试评论', author: '测试用户', email: '测试用asdt@test.com', url: '' },
            { comment: "123123123123', ''); DROP TABLE wp_posts; --", author: '', email: 'test@test.com', url: '' },
            { comment: "test comment 1', ''); DROP TABLE wp_users; --", author: 'testUser1', email: 'testUser1@gmail.com', url: '' },

        ];

        for (let i = 0; i < testCases.length; i++) {
            let testCase = testCases[i];
            console.log(`Attemp number: ${i + 1}:`);
            console.log('Input data:');
            console.log('Comment:', testCase.comment);
            console.log('Author:', testCase.author);
            console.log('Email:', testCase.email);
            console.log('URL:', testCase.url);

            let commentInput = await driver.findElement(By.id('comment')),
                authorInput = await driver.findElement(By.id('author')),
                emailInput = await driver.findElement(By.id('email')),
                urlInput = await driver.findElement(By.id('url')),
                submitButton = await driver.findElement(By.id('submit'));

            await commentInput.sendKeys(testCase.comment);
            await authorInput.sendKeys(testCase.author);
            await emailInput.sendKeys(testCase.email);
            await urlInput.sendKeys(testCase.url);

            await submitButton.click();
            await driver.wait(until.stalenessOf(commentInput));

            let currentUrl = await driver.getCurrentUrl();
            if (currentUrl !== 'https://skleptest.pl/wp-comments-post.php') {
                console.log('No redirection');
                console.log('--------------------------------------------------------------------------');

            } else {
                console.log('Redirected to error page');
                let errorMessage = await driver.findElement(By.css('.wp-die-message p')).getText();
                console.log('Error message:', errorMessage);
                console.log('--------------------------------------------------------------------------');
                await driver.navigate().back();
            }

            commentInput = await driver.findElement(By.id('comment'));
            authorInput = await driver.findElement(By.id('author'));
            emailInput = await driver.findElement(By.id('email'));
            urlInput = await driver.findElement(By.id('url'));

            await commentInput.clear();
            await authorInput.clear();
            await emailInput.clear();
            await urlInput.clear();

        }
    } catch (error) {
        console.error(`Error: ${error}`);
    } finally {
        await driver.quit();
    }
}
// testHoverOnMobile();
testCommentForm();
