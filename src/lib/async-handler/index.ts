function asyncHandler (func: Function) {
  return (...args: any[]) => {
    const result = func(...args);
    const next = args.pop();

    return Promise.resolve(result).catch(next);
  };
}

export default asyncHandler;
