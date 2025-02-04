# ui-local-kb-admin

Copyright (C) 2018-2019 The Open Library Foundation

This software is distributed under the terms of the Apache License, Version 2.0. See the file "[LICENSE](LICENSE)" for more information.

## Introduction

The Local KB Admin UI Module, or `ui-local-kb-admin`, is a Stripes UI module used for management of the local KB used for ERM tasks handled by the `ui-agreements` (Agreements) module.

## Prerequisites

In order to view and log into the platform being served up, a suitable Okapi backend will need to be running. The [Folio testing-backend](https://app.vagrantup.com/folio/boxes/testing-backend) Vagrant box should work if your app does not yet have its own backend module.

Additionally, until it is part of the Okapi backends, the [mod-agreements](https://github.com/folio-org/mod-agreements) module needs to be running.

## Running

Note that the following commands require that [`stripes-cli`](https://github.com/folio-org/stripes-cli) is installed globally.

Run the following from the ui-local-kb-admin directory to serve `ui-local-kb-admin` by itself using a development server:
```
stripes serve
```

Note: When serving up a newly created app that does not have its own backend permissions established, pass the `--hasAllPerms` option to display the app in the UI navigation. For example:
```
stripes serve --hasAllPerms
```

To specify your own tenant ID or to use an Okapi instance other than http://localhost:9130, pass the `--okapi` and `--tenant` options.
```
stripes serve --okapi http://my-okapi.example.com:9130 --tenant my-tenant-id
```

To run `ui-local-kb-admin` within a Stripes platform:

1. Create a workspace with `stripes workspace` and select whatever modules you want (e.g., `ui-users` and `ui-local-kb-admin`) and at least one platform such as `stripes-sample-platform`.
1. Navigate to the platform's directory and run `stripes serve stripes.config.js.local`.

## Additional information

Read the [Stripes Module Developer's Guide](https://github.com/folio-org/stripes/blob/master/doc/dev-guide.md).

Other [modules](https://dev.folio.org/source-code/#client-side).

See project [ERM](https://issues.folio.org/browse/ERM)
at the [FOLIO issue tracker](https://dev.folio.org/guidelines/issue-tracker).

Other FOLIO Developer documentation is at [dev.folio.org](https://dev.folio.org/)

