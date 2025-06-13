declare module '@commercetools-frontend/application-shell-connectors' {
  export interface ApplicationRuntimeEnvironment {
    cloudinaryEnabled?: string;
    cloudinaryCloudName?: string;
    cloudinaryUploadPreset?: string;
  }
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cloudinary?: any;
  }
}

declare module '*.graphql' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const content: any;
  export default content;
}

declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.png';
declare module '*.svg';

export {};
