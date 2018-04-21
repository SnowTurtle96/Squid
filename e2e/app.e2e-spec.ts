import { SquidPage } from './app.po';

describe('squid App', () => {
  let page: SquidPage;

  beforeEach(() => {
    page = new SquidPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
