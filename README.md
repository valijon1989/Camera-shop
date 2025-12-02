# All Camera World React

Frontend for the All Camera World platform, where a single admin manages inventory, agents keep listings fresh, and users shop for cameras, lenses, drones, and accessories.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## Default AI model (project-wide)

This project includes a project-level environment variable to select the default AI/model used by client code: `REACT_APP_DEFAULT_AI_MODEL`.

- To enable Raptor mini (Preview) for all clients, set:

	```env
	REACT_APP_DEFAULT_AI_MODEL=raptor-mini-preview
	```

- Individual components or services can override this by explicitly using a different model identifier in their configuration or requests.

We added `src/lib/config.ts` which now exports `defaultAIModel` from `process.env.REACT_APP_DEFAULT_AI_MODEL` and falls back to `raptor-mini-preview` if unset.

## Local demo backend (file uploads)

This repo now contains a small demo backend under the `server/` folder so you can test file uploads locally and serve uploaded images from `/uploads`.

Quick start for local testing:

```bash
cd server
npm install
npm run start
```

Server endpoints:
- POST /api/cameras — accepts multipart form-data with `images` files and returns the created product with `images` pointing to `uploads/<filename>`
- GET /api/cameras — returns an in-memory list of products (use `/api/seed-demo` to pre-seed two demo products)

This allows the frontend to create products using `multipart/form-data` (Add Product) and then display images (served from http://localhost:9090/uploads/...).
