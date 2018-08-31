# Helios 

A Chrome Dev Tool for tracking state in Apollo and Vue.js.

![](icon48.png)

## Getting Started

To use Helios install our Chrome Dev Tool. In your Vue application, bind our custom function to your component . Wrap the built-in Apollo mutate method with the custom method from our library. 

After that the Chrome Dev Tool observes your application, allowing it to pass messages between the browser and Helios. Helios captures the Apollo state immediately before and immediately after the mutation and does a diff on those two objects, organizing them by mutation type, and displays the changes in the dev tool panel.

### Prerequisites

Google Chrome, the Helios extension and the code below in a util file (`Helios.js`)

### Installing

After installing the [Helios extension](https://chrome.google.com/webstore/detail/helios/mjbbelnbkfohllaknipiibodjnjhofhk), create a file in your project called `Helios.js` containing the following code:

```
export default function ApolloDev (configObj) {
  const prevState = JSON.parse(
    JSON.stringify(this.$apolloProvider.clients.defaultClient.cache.data.data))
  return new Promise((resolve, reject) => {
    this.$apollo.mutate(configObj).then(res => {
      const newState = this.$apolloProvider.clients.defaultClient.cache.data.data
      window.postMessage([prevState, newState], '*')
      resolve(res)
    })
  })
}
```

Now import `Helios.js` wherever you make state mutations

```
import ApolloDev from "../utils/Helios";
```

Finally, bind the function and make your state mutation.

```
this.ApolloDev = ApolloDev.bind(this);
      this.ApolloDev({
        mutation: CREATE_VOTE_MUTATION,
        variables: {
          userId,
          linkId
        },
        update: (store, { data: { createVote } }) => {
          this.updateStoreAfterVote(store, createVote, linkId);
        }
      });
```

## Built With

* [deep-diff](https://www.npmjs.com/package/deep-diff) - A diffing tool for determining structural differences between objects
* [Browserify](http://browserify.org) - Dependency bundler
* [Apollo-Client](https://github.com/apollographql/apollo-client) - A fully-featured GraphQL client

## Contributing

Fork the repo and create a pull request

## Authors

* **[Erik Cox](https://github.com/erikcox)** - *Chrome Dev Tool UI and messaging* 
* **[Stephanie Fong](https://github.com/stfong)** - *Designed wrapper function for Apoll retaining original mutate functionality* 
* **[Paul Valderama](https://github.com/pvalderama)** - *Developed diffing function for Apollo state objects* 

## License

This project is licensed under the MIT License

## Acknowledgments

* Hat tip to the whole [Front Street Solutions](https://github.com/Front-Street/research) team for assistance and inspiration to build this tool
