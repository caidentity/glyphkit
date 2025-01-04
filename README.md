# GlyphKit

GlyphKit is a comprehensive icon toolkit designed to bring quality to any application.

## Technologies

- Next.js 13+
- React 18
- TypeScript
- TanStack Query


## Scripts

- `dev`: Start development server
- `build`: Create production build
- `start`: Start production server
- `generate-icons`: Generate icon metadata
- `lint`: Run ESLint
- `type-check`: Run TypeScript compiler check




## Generating Icons
Follow these steps to create and integrate icons into the project:

### 1. Generate Icons
Navigate to the packages/glyphkit folder.
Add the SVG source files for the icons in the appropriate directory.
Run the following command to generate icons and push the data to the appropriate JavaScript files for handling paths and metadata:
bash
Copy code
npm run createicon  
afterwards make sure to run npm run bild to make sure bundled correctly and added to registary.

### 2. Verify Setup
After generating the icons, verify that the setup is correct.
Adjust tags or categories as needed to ensure proper organization and metadata accuracy.

### 3. Update the Demo Application
Edit the app.tsx file located in the packages/glyphkit/demo folder to reflect the newly added icons.
To verify the setup, run the development server:
bash
Copy code
npm run dev  

### 4. Build the Package
Once the icons are verified and the paths are set up properly, build the package:
bash
Copy code
npm run build  

### 5. Sync with the Site
Navigate to the site folder and run the following command to fetch the source registry and update the site:
bash
Copy code
npm run build  
Note: Ensure that the package is built (npm run build in packages/glyphkit) before this step.

### 6. Deploy to NPM
To see the updates on the site, deploy the latest package to NPM so the site can fetch and render the changes.




## Setup

1. Generate icon metadata:
npm run generate-icons

This script scans the `public/icons` directory and generates metadata for all SVG icons.

## Development

Run the development server:



# Scripts
## Package Glyphkit 
### 1. First run convert-paths to normalize all icon files
npm run convert-paths

### 2. Then run generate-icons to update the package
npm run generate:icons

Once both run... publish so the site can fetch

## GlyphKit.com Site 
For the site to proropery render and read all sites... run npm run build to gather all names and catagories in the package.
make sure getting latest build of the package...
