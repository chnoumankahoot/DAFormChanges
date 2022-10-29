import React from "react";

import ContentLoader from "react-content-loader";

const Loader = () => (
  <ContentLoader width="80%">
    <rect x="0" y="17" rx="4" ry="4" width="70%" height="16" />
    <rect x="0" y="40" rx="3" ry="3" width="60%" height="13" />
    <rect x="0" y="60" rx="3" ry="3" width="50%" height="10" />
  </ContentLoader>
);

export default Loader;