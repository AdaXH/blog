export function mapChildren(obj, theme) {
  if (!obj) return obj;
  try {
    const newChildren = obj.props.children.map(item => {
      return {
        ...item,
        props: {
          ...item.props,
          theme,
        },
      };
    });
    return {
      ...obj,
      props: {
        ...obj.props,
        children: newChildren,
      },
    };
  } catch (error) {
    return obj;
  }
}
