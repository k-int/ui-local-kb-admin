import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { getSASParams } from '@folio/stripes-erm-components';
import { FormattedMessage } from 'react-intl';
import { StripesConnectedSource } from '@folio/stripes/smart-components';
import { stripesConnect } from '@folio/stripes/core';
import { Callout } from '@folio/stripes/components';
import View from '../components/views/Jobs';

const INITIAL_RESULT_COUNT = 100;
const RESULT_COUNT_INCREMENT = 100;

class JobsRoute extends React.Component {
  static manifest = Object.freeze({
    jobs: {
      type: 'okapi',
      recordsRequired: '%{resultCount}',
      records: 'results',
      perRequest: RESULT_COUNT_INCREMENT,
      limitParam: 'perPage',
      path: 'erm/jobs',
      params: getSASParams({
        searchKey: 'name',
        filterConfig: [{
          name: 'class',
          values: [
            { name: 'Harvester', value: 'org.olf.general.jobs.PackageIngestJob' },
            { name: 'File import', value: 'org.olf.general.jobs.PackageImportJob' }
          ],
        }],
      })
    },
    resultValues: {
      type: 'okapi',
      path: 'erm/refdataValues/persistentJob/result',
      shouldRefresh: () => false,
    },
    statusValues: {
      type: 'okapi',
      path: 'erm/refdataValues/persistentJob/status',
      shouldRefresh: () => false,
    },
    query: { initialValue: {} },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
  });

  static propTypes = {
    children: PropTypes.node,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string,
      search: PropTypes.string,
    }).isRequired,
    mutator: PropTypes.object,
    resources: PropTypes.object,
    stripes: PropTypes.shape({
      logger: PropTypes.object,
    }),
  }

  constructor(props) {
    super(props);

    this.logger = props.stripes.logger;
    this.searchField = React.createRef();
    this.callout = React.createRef();
  }

  componentDidMount() {
    this.source = new StripesConnectedSource(this.props, this.logger, 'jobs');

    if (this.searchField.current) {
      this.searchField.current.focus();
    }
  }

  componentDidUpdate(prevProps) {
    const newCount = this.source.totalCount();
    const newRecords = this.source.records();

    if (newCount === 1) {
      const { history, location } = this.props;

      const prevSource = new StripesConnectedSource(prevProps, this.logger, 'jobs');
      const oldCount = prevSource.totalCount();
      const oldRecords = prevSource.records();

      if (oldCount !== 1 || (oldCount === 1 && oldRecords[0].id !== newRecords[0].id)) {
        const record = newRecords[0];
        history.push(`/local-kb-admin/${record.id}${location.search}`);
      }
    }

    const prevDeletedJobId = get(prevProps, 'location.state.deletedJobId', '');
    const currentDeletedJobId = get(this.props, 'location.state.deletedJobId', '');
    if (prevDeletedJobId !== currentDeletedJobId) {
      const name = get(this.props, 'location.state.deletedJobName', '');
      if (name !== '') this.showToast('ui-local-kb-admin.job.delete.success', 'success', { name });
    }
  }

  querySetter = ({ nsValues, state }) => {
    const defaults = {
      filters: null,
      query: null,
      sort: null,
    };

    if (/reset/.test(state.changeType)) {
      this.props.mutator.query.update({ ...defaults, ...nsValues });
    } else {
      this.props.mutator.query.update(nsValues);
    }
  }

  queryGetter = () => {
    return get(this.props.resources, 'query', {});
  }

  showToast = (messageId, messageType = 'success', values = {}) => {
    return this.callout.current.sendCallout({
      message: <FormattedMessage id={messageId} values={values} />,
      type: messageType,
    });
  }

  render() {
    const { children, location, resources } = this.props;
    if (this.source) {
      this.source.update(this.props, 'jobs');
    }

    return (
      <div>
        <View
          data={{
            jobs: get(resources, 'jobs.records', []),
            resultValues: get(resources, 'resultValues.records', []),
            statusValues: get(resources, 'statusValues.records', []),
          }}
          queryGetter={this.queryGetter}
          querySetter={this.querySetter}
          searchString={location.search}
          source={this.source}
        >
          {children}
        </View>
        <Callout ref={this.callout} />
      </div>

    );
  }
}

export default stripesConnect(JobsRoute);
