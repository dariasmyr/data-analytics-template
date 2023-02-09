# Data Analytics Template
This data analytics template provides a quick and easy solution for connecting to NeDB database, operating with data through separate modules, and saving results with Prisma ORM. The template is written in TypeScript and includes a logger service and ESlint code formatter to enhance your development experience.

## Getting Started
1) Clone this repository to your local machine:
bash
`git clone https://gitlab.com/daria_smyr/data-analytics-template.git`
2) Install the necessary dependencies:
`npm install`
3) Create and connect to your NeDB database by updating the database file path in `src/app.ts`.
4) Start operating with your data using the separate modules in `src/modules/`.
5) Save your results with Prisma ORM by updating the Prisma configuration in `prisma/schema.prisma`. 
6) Run `npm run build && npm start` to start the template.

## Features
- The template is written in TypeScript and can be easily configured to suit your needs in `tsconfig.json`.
- Connect to NeDB database
- Operate with data through separate modules
- Save results with Prisma ORM
- Logger service for debugging and tracking events. The logger service can also be configured in the `src/logger.js` file.
- ESlint code formatter for consistent and readable code. The ESlint rules can be configured in the `.eslintrc.js` file.

## Dependencies
- NeDB
- Prisma ORM
- Log4js (logger service)
- ESlint

## Database workflow with Prisma
- Edit schema in `prisma/schema.prisma`
- Run `npm run db:create` to create the database
- Run `npm run db:generate` to generate the Prisma client
- Run `npm run db:studio` to open Prisma Studio
- Run `npm run db:format` to format the schema

The default SQLite database path is `data/data.sqlite3`.

## Contributing
If you find any issues or want to contribute to this project, please feel free to comment or open an issue. All contributions and feedback are welcomed!

## Support
If you find this project useful, please consider supporting it by giving it a star ⭐️.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
Copyright © 2023 dasha.smyr@gmail.com.
