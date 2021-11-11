import { NgModule } from '@angular/core';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache, ApolloClientOptions } from '@apollo/client/core';

export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
  const uri = 'http://localhost:3000/graphql'; // Backend services graphql URL
  return {
    link: httpLink.create({uri}),
    cache: new InMemoryCache()
  };
}

@NgModule({
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [ HttpLink ]
    }
  ]
})
export class GraphQLModule {}
