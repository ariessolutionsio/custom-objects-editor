const intlMock = {
  formatMessage: jest.fn((message) => message.id),
  formatDate: jest.fn(() => 'xxx'),
  formatTime: jest.fn(() => 'xxx'),
  formatRelative: jest.fn(() => 'xxx'),
  formatNumber: jest.fn((number) => number.toString()),
  formatPlural: jest.fn(() => 'xxx'),
  formatHTMLMessage: jest.fn(() => 'xxx'),
  now: jest.fn(() => 'xxx'),
  locale: 'en',
};

export default intlMock;
