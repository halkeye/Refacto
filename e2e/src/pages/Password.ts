import { By, WebDriver } from 'selenium-webdriver';
import Page from './common/Page';
import Retro from './Retro';

export default class Password extends Page {
  public constructor(driver: WebDriver, slug: string) {
    super(driver, `/retros/${slug}`, '.page-password');
  }

  public setPassword(pass: string): Promise<void> {
    return this.setFormValue(By.css('form input[type=password]'), pass);
  }

  public async submit(): Promise<Retro> {
    this.click(By.css('form button'));

    return new Retro(this.driver, 'unknown').wait();
  }
}
