import RequestHandler from '../../lib/ipfs/RequestHandler';
import { Response, ResponseStatus } from '../../lib/core/Response';

describe('RequestHandler', () => {
  let requestHandler: RequestHandler;

  beforeEach(() => {
    const ipfsOptions = {
      repo: 'sidetree-ipfs',
      init: false,
      start: false
    };
    requestHandler = new RequestHandler(10, ipfsOptions);
  });

  it('should return the correct response object for invalid multihash for fetch request.', async () => {
    const expectedResponse: Response = {
      status: ResponseStatus.BadRequest,
      body: { error: 'Invalid content Hash' }
    };

    const testSidetreeHash: string = '123abc';
    const fetchedResponse = await requestHandler.handleFetchRequest(testSidetreeHash);

    expect(expectedResponse).toEqual(fetchedResponse);
  });

  it('should return the correct response body with content for fetch request', async () => {
    const expectedResponse: Response = {
      status: ResponseStatus.Succeeded,
      body: Buffer.from('dummyContent')
    };
    const testSidetreeHash: string = 'EiCcvAfD-ZFyWDajqipYHKICkZiqQgudmbwOEx2fPiy-Rw';
    spyOn(requestHandler.ipfsStorage, 'read').and.returnValue(Promise.resolve(Buffer.from('dummyContent')));

    const fetchedResponse = await requestHandler.handleFetchRequest(testSidetreeHash);

    expect(expectedResponse).toEqual(fetchedResponse);
  });

  it('should return the correct response body with content for write request', async () => {
    const expectedResponse: Response = {
      status: ResponseStatus.Succeeded,
      body: { hash: 'EiCcvAfD-ZFyWDajqipYHKICkZiqQgudmbwOEx2fPiy-Rw' }
    };

    // Mock the IPFS storage layer to return a Base58 encoded multihash regardless of content written.
    spyOn(requestHandler.ipfsStorage, 'write').and.returnValue(Promise.resolve('QmYtUc4iTCbbfVSDNKvtQqrfyezPPnFvE33wFmutw9PBBk'));
    const mockSidetreeContent: Buffer = Buffer.from('dummyContent');

    const fetchedResponse = await requestHandler.handleWriteRequest(mockSidetreeContent);

    expect(expectedResponse).toEqual(fetchedResponse);
  });
});
