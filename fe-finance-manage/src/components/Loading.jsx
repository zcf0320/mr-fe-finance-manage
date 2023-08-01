export default ({ isLoading, error }) => {
  if (isLoading) {
    return <div>Loading...</div>;
  } else if (error) {
    return <div>Loading...</div>;
  }
  else {
    return null;
  }
};