import url from 'url';
import {
  By,
  until,
  WebDriver,
  WebElementCondition,
} from 'selenium-webdriver';
import customUntil from '../helpers/customUntil';

const HOST = process.env.TARGET_HOST!;

const untilNoLoaders = customUntil.noElementLocated(By.css('.loader'));

export default abstract class Page {
  private readonly untilNavigated: WebElementCondition;

  protected constructor(
    protected readonly driver: WebDriver,
    private readonly subpath: string,
    expectedCSS: string,
  ) {
    this.untilNavigated = until.elementLocated(By.css(expectedCSS));
  }

  public async load(): Promise<this> {
    const path = url.resolve(HOST, this.subpath);
    process.stdout.write(`Navigating to ${path}\n`);
    await this.driver.get(path);
    await this.wait();
    return this;
  }

  public async wait(): Promise<this> {
    await this.driver.wait(this.untilNavigated, 5000);
    await this.driver.wait(untilNoLoaders, 5000);
    // wait an additional frame to allow some async events (e.g. title changes)
    await this.driver.sleep(100);
    return this;
  }

  public getTitle(): Promise<string> {
    return this.driver.getTitle();
  }

  public setFormValue(selector: By, value: string): Promise<void> {
    return this.driver.findElement(selector).sendKeys(value);
  }

  public click(selector: By): Promise<void> {
    return this.driver.findElement(selector).click();
  }

  public async expectChange(fn: () => (void | Promise<void>)): Promise<void> {
    const body = await this.driver.findElement(By.css('body'));
    const oldState = await body.getText();
    await fn();
    await this.driver.wait(async () => {
      const state = await body.getText();
      return state !== oldState;
    });
  }
}