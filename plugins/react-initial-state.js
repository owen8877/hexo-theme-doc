'use strict';

module.exports = ({hexo}) => {
  const allowedProperties = {
    config: [
      'root',
      'theme',
      'theme_config',
      'time_format',
      'timezone'
    ],
    page: [
      'path',
      'title',
      'support'
    ]
  };

  const filter = (source, allowedValues) => {
    return Object
      .keys(source)
      .filter(key => allowedValues.includes(key))
      .reduce((obj, key) => {
        obj[key] = source[key];
        return obj;
      }, {});
  };

  const recursive_build = o => {
    return o.map(item => {
      if (typeof item === "object") {
        let key = Object.keys(item)[0]
        let value = item[key]
          if (typeof value === "object") // A label with children
            return {text: key, type: "label", children: recursive_build(value)}
          else // A link
            return {text: key, type: "link", path: value}
      } else // A label with no children
        return {text: item, type: "label"}
    })
  }

  const build_navigation = n => {
    return n.build ? n : {logo: {text: n.logo, type: "link", path: "index.html"}, main: recursive_build(n.main), build: true}
  }

  hexo.extend.filter.register('template_locals', function (locals){

    let data = locals.site.data;

    data.navigation = build_navigation(data.navigation);

    const page = filter(locals.page, allowedProperties.page);

    const config = filter(locals.config, allowedProperties.config);

    locals.initial_state = {
      page,
      data,
      config
    };

    return locals;
  }, 20);
};
