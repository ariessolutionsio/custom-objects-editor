---
layout: default
title: Home
nav_order: 1
permalink: /
---

<!--prettier-ignore-start-->
# Custom Objects Editor

Manage your custom objects directly from the Merchant Center.
{: .fs-6 .fw-300 }

commercetools offers unparalleled data configuration; however, there are
situations where a company needs to store information that does not fit neatly
into an existing endpoint. In these situations, commercetools offers a generic
endpoint - [Custom Objects](https://docs.commercetools.com/api/projects/custom-objects).
Custom Objects are a great way to store your JSON data. Some example use-cases may include 
brand data, company profiles, shared product data, and feature flags.

This application extends the commercetools Merchant Center to allow an end-user to define
a JSON data schema and Create, Read, Update, and Delete objects tied to that schema.

_NOTE: Data modeling is an important aspect of any project and can have a big impact on your
project's success and application performance. We recommend getting advice from an experience 
professional. Please feel free to [reach out](https://www.ariessolutions.io/contact-aries/) with any questions._

[Get started now](#getting-started){: .btn .btn-primary .fs-5 .mb-4 .mb-md-0 .mr-2 } [View it on GitHub](https://github.com/ariessolutionsio/custom-objects-editor){: .btn .fs-5 .mb-4 .mb-md-0 }

---


## Getting started

### Configure Custom Application with Merchant Center



In order to use this custom application, you'll need to register it inside of the Merchant Center.
You can **demo** the application with our hosted version. For use in production please deploy the
application to your own cloud environment or contact us for help.

 - [TBD](LINK)

To register your Custom Application with a Merchant Center project:

1. In the main navigation of the Merchant Center, navigate to **User Icon > Manage Organization and Teams**. Click on the organizaiton where you want to install the application.

2. From your organization page, navigate to the tab **Custom Applications** and clck the **Configure Custom Applications** button. Then click the **Add a Custom Application** button.
    
3.  Fill in the fields as follows:

- **Application Name**: Custom Objects
- **Application Url**: Your hosting location
- **Application entry point URI path**: `custom-objects`
- **Permissions**: Manage Products, Manage Orders, Manage Customers
- **Sub Navigation** _(Optional)_
  - Custom Object List
    - **Link To**: `/`
    - **Link Permissions**: Manage Products, Manage Orders, Manage Customers
  - Container Schema List
    - **Link To**: `containers`
    - **Link Permissions**: Manage Products, Manage Orders, Manage Customers
        
4.  Click **Register Custom Application**.

5.  Install the application in your desired projects. From the organization's Custom Applications screen click on the **Install Custom Applications** button. Choose the application. Install in all or selected projects for that organization.

---

## License

Aries code and modifications licensed under the [GNU AGPLv3 license](https://www.gnu.org/licenses/agpl-3.0.en.html).
Libraries, dependencies, and code pulled into this project will retain their existing license.

If you would like to discuss alternative licensing or leveraging this application in your composable stack, please [reach out to Aries Solutions](https://www.ariessolutions.io/contact-aries/) to discuss options.

#### Disclaimer

Please note: all tools / scripts in this repository are released for use "AS IS"
without any warranties of any kind, including, but not limited to their
installation, use, or performance. We disclaim any and all warranties, either
express or implied, including but not limited to any warranty of
noninfringement, merchantability, and/ or fitness for a particular purpose. We
do not warrant that the technology will meet your requirements, that the
operation thereof will be uninterrupted or error-free, or that any errors will
be corrected.

Any use of these scripts and tools is at your own risk. There is no guarantee
that they have been through thorough testing in a comparable environment and we
are not responsible for any damage or data loss incurred with their use.

You are responsible for reviewing and testing any scripts you run _thoroughly_
before use in any non-testing environment.

## Support

Need help with your project? Contact the Aries Solutions team for
assistance.
