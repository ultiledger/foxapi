# Ripplefox Api

## REST market price lastest 24hours

### GET /v2/exchanges

### GET /v2/exchanges/pair/:pair

name | type | Ranges
----|------|----
pair | string  | xrpcny, xlmcny, ultcny, ultxrp, xlmxrp

### Response

name | type | desc
----|------|----
base_volume | number  | base currecny volume
close | string  | current price
high | string  | 24h high price

# Install

## install nvm
sudo curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash

## install node
nvm install node

# install yarn

curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list

sudo apt-get update && sudo apt-get install yarn




