import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Button } from '@folio/stripes/components';
import ExternalDataSourcesEdit from './ExternalDataSourcesEdit';
import ExternalDataSourcesView from './ExternalDataSourcesView';

export default class ExternalDataSourcesFields extends React.Component {
  static propTypes = {
    onDelete: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    input: PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.shape({
        id: PropTypes.string,
      }).isRequired,
    }).isRequired,
    meta: PropTypes.shape({
      invalid: PropTypes.bool,
      pristine: PropTypes.bool,
      submitting: PropTypes.bool,
    }),
    mutators: PropTypes.shape({
      resetTermState: PropTypes.func,
      setTermValue: PropTypes.func,
    })
  }

  constructor(props) {
    super(props);

    const { value } = props.input;

    this.state = {
      editing: !(value && value.id),
      initialValue: value,
    };
  }

  handleEdit = () => {
    this.props.mutators.resetTermState(this.props.input.name);

    this.setState({
      initialValue: this.props.input.value,
      editing: true,
    });
  }

  handleCancel = () => {
    const {
      input: { name, value },
      onDelete,
    } = this.props;

    if (value.id) {
      this.props.mutators.setTermValue(name, this.state.initialValue);
    } else {
      onDelete();
    }

    this.setState({
      editing: false,
    });
  }

  handleSave = () => {
    this.props.onSave()
      .then(() => this.setState({ editing: false }));
  }

  renderActionButtons = () => {
    const {
      meta,
      onDelete
    } = this.props;

    const { editing } = this.state;

    if (editing) {
      return (
        <span>
          <Button
            data-test-external-data-source-cancel
            marginBottom0
            onClick={this.handleCancel}
          >
            <FormattedMessage id="stripes-core.button.cancel" />
          </Button>
          <Button
            disabled={meta.invalid || meta.pristine || meta.submitting}
            marginBottom0
            onClick={this.handleSave}
          >
            <FormattedMessage id="stripes-core.button.save" />
          </Button>
        </span>
      );
    } else {
      return (
        <span>
          <Button
            data-test-external-data-source-delete
            buttonStyle="danger"
            marginBottom0
            onClick={onDelete}
          >
            <FormattedMessage id="stripes-core.button.delete" />
          </Button>
          <Button
            data-test-external-data-source-edit
            marginBottom0
            onClick={this.handleEdit}
          >
            <FormattedMessage id="stripes-core.button.edit" />
          </Button>
        </span>
      );
    }
  }

  render() {
    const ExternalDataSourceComponent = this.state.editing ? ExternalDataSourcesEdit : ExternalDataSourcesView;
    return (
      <ExternalDataSourceComponent
        {...this.props}
        actionButtons={this.renderActionButtons()}
      />
    );
  }
}
