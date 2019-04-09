import RepositoryManager from '../../../../src/Resource/Repository/RepositoryManager';
import ParameterBag from '../../../../src/Resource/ParameterBag';

describe('The resource repository', () => {
  const axiosResponseData = {
    data: {
      data: [
        {
          id: 1,
          title: 'test',
        },
      ],
      paging: {
        count: 0,
        pages: 0,
      },
    },
    status: 200,
    statusText: 'OK',
  };

  const identifier = 'tid';
  const connector = {
    fetch: jest.fn(() => Promise.resolve(axiosResponseData)),
    fetchOne: jest.fn(() => Promise.resolve(axiosResponseData.data)),
  };

  it('should have the correct identifier and resource type after the creation', () => {
    const repository = RepositoryManager.createRepository({}, 'testtype', identifier);
    expect(repository.identifier).toBe(identifier);
    expect(repository.resourceType).toBe('testtype');
  });

  it('should default the id to "id" when the id is omitted in the factory', () => {
    const repository = RepositoryManager.createRepository({}, 'testtype2');
    expect(repository.identifier).toEqual('id');
  });

  it('should have the immutable properties resourceType and identifier after creation', () => {
    const repository = RepositoryManager.createRepository({}, 'testtype3', identifier);
    expect(() => { repository.resourceType = 'new'; }).toThrow(TypeError);
    expect(() => { repository.identifier = 'otherid'; }).toThrow(TypeError);
  });

  it('should use the connector fetch once for the find method to do requests.', () => {
    const connectorFind = {
      fetch: jest.fn(() => Promise.resolve(axiosResponseData)),
    };
    const repository = RepositoryManager.createRepository(connectorFind, 'testtype4', identifier);
    repository.find(new ParameterBag());
    expect(connectorFind.fetch.mock.calls).toHaveLength(1);
  });

  it('should return the promise of the connector after a find containing the data array', () => {
    const repository = RepositoryManager.createRepository(connector, 'testtype7', identifier);
    return repository.find(new ParameterBag()).then((data) => {
      expect(data).toBe(axiosResponseData.data);
    });
  });

  it('should use the connector fetch once for the findOne method to do requests.', () => {
    const connectorFindOne = {
      fetch: jest.fn(() => Promise.resolve(axiosResponseData)),
    };
    const repository = RepositoryManager.createRepository(connectorFindOne, 'testtype5', identifier);
    repository.findOne(new ParameterBag());
    expect(connectorFindOne.fetch.mock.calls).toHaveLength(1);
  });

  it('should return the promise of the connector after a findOne containing the first element of the data array', () => {
    const repository = RepositoryManager.createRepository(connector, 'testtype8', identifier);
    return repository.findOne(new ParameterBag()).then((data) => {
      expect(data).toEqual(axiosResponseData.data.data[0]);
    });
  });

  it('should use the connector fetchOne once for the findById method to do requests.', () => {
    const connectorFindById = {
      fetchOne: jest.fn(() => Promise.resolve(axiosResponseData.data)),
    };
    const repository = RepositoryManager.createRepository(connectorFindById, 'testtype6', identifier);
    repository.findById(1);
    expect(connectorFindById.fetchOne.mock.calls).toHaveLength(1);
  });

  it('should return the promise of the connector after a findById containing the data', () => {
    const repository = RepositoryManager.createRepository(connector, 'testtype9', identifier);
    return repository.findById(1).then((data) => {
      expect(data).toBe(axiosResponseData.data);
    });
  });
});
