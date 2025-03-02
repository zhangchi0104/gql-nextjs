DIRNAME=$(dirname $0)
echo $DIRNAME
SERVER_ROOT=$DIRNAME/..
PROJECT_ROOT=$SERVER_ROOT/../..
GRAPHQL_SCHEMA_PATH=$PROJECT_ROOT/packages/graphql/schema.graphql
mkdir -p $SERVER_ROOT/dist
cp $GRAPHQL_SCHEMA_PATH $SERVER_ROOT/dist/schema.graphql
bun build $SERVER_ROOT/src/handler.ts --target=node --outfile=$SERVER_ROOT/dist/lambda.js 
zip -j $SERVER_ROOT/dist/lambda.zip $SERVER_ROOT/dist/lambda.js $SERVER_ROOT/dist/schema.graphql $SERVER_ROOT/package.json
