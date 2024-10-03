# Developer Documentation

The steps and guides involved for the development team, to work together will be straight and simple.

## Directories
* `src/assets:` This directory will handle all the images involved in the development process.
* `src/lib:` The firebase configuration should be handled in this directory using env variables to protect sensitive keys. This directory will also hold logic for the registration and co.
* `src/styles:` All css styles will be handled here, the primary styling for the project is vanilla css along side bootstrap and other similar libraries.
* `src/pages:` Due to the size of the project, there will be number of pages. This directory will handle pages like Home, About, Contact, Policy, products, etc.
* `src/authentication:` The user authentication screens like login, register, forget password, and getDash screens will be handled in this directory.
* `src/dashboards:` The system will consist of 3 dashboards based on the `user.role` of the user; one for admin, one for agents, and one for regular users.
* `src/components:` In order to keep our codes DRY, we would break certain parts into smaller components so they can be reused.