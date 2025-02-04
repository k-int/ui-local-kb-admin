import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';
import { FileUploaderField } from '@folio/stripes-erm-components';
import { AppIcon, TitleManager } from '@folio/stripes/core';
import stripesForm from '@folio/stripes/form';

import {
  Button,
  IconButton,
  Pane,
  PaneFooter,
  PaneMenu,
  Paneset,
} from '@folio/stripes/components';

import css from './JobForm.css';

class JobForm extends React.Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    handlers: PropTypes.shape({
      onClose: PropTypes.func.isRequired,
      onDownloadFile: PropTypes.func.isRequired,
      onUploadFile: PropTypes.func.isRequired,
    }),
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    invalid: PropTypes.bool
  }

  renderPaneFooter() {
    const startButton = (
      <Button
        buttonStyle="default mega"
        id="clickable-cancel"
        marginBottom0
        onClick={this.props.handlers.onClose}
      >
        <FormattedMessage id="stripes-components.cancel" />
      </Button>
    );

    const endButton = (
      <Button
        buttonStyle="primary mega"
        data-test-save-button
        disabled={this.props.pristine || this.props.submitting || this.props.invalid}
        marginBottom0
        onClick={this.props.handleSubmit}
        type="submit"
      >
        <FormattedMessage id="stripes-components.saveAndClose" />
      </Button>
    );

    return (
      <PaneFooter
        renderStart={startButton}
        renderEnd={endButton}
      />
    );
  }

  renderFirstMenu() {
    return (
      <PaneMenu>
        <FormattedMessage id="ui-local-kb-admin.job.close">
          {ariaLabel => (
            <IconButton
              icon="times"
              id="close-job-form-button"
              onClick={this.props.handlers.onClose}
              aria-label={ariaLabel}
            />
          )}
        </FormattedMessage>
      </PaneMenu>
    );
  }

  validateUploadFile(value) {
    if (value === null) return <FormattedMessage id="ui-local-kb-admin.error.uploadFile" />;
    return undefined;
  }

  render() {
    const { handlers: { onDownloadFile, onUploadFile } } = this.props;
    return (
      <Paneset>
        <FormattedMessage id="ui-local-kb-admin.create">
          {create => (
            <Pane
              appIcon={<AppIcon app="local-kb-admin" />}
              defaultWidth="100%"
              footer={this.renderPaneFooter()}
              id="pane-job-form"
              firstMenu={this.renderFirstMenu()}
              paneTitle={<FormattedMessage id="ui-local-kb-admin.job.newJob" />}
            >
              <TitleManager record={create}>
                <form>
                  <div className={css.jobForm}>
                    <Field
                      component={FileUploaderField}
                      data-test-document-field-file
                      id="fileUploadId"
                      label={<FormattedMessage id="stripes-erm-components.doc.file" />}
                      name="fileUpload"
                      onDownloadFile={onDownloadFile}
                      onUploadFile={onUploadFile}
                      validate={this.validateUploadFile}
                    />
                  </div>
                </form>
              </TitleManager>
            </Pane>
          )}
        </FormattedMessage>
      </Paneset>
    );
  }
}

export default stripesForm({
  form: 'JobForm',
  navigationCheck: true,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
})(JobForm);
