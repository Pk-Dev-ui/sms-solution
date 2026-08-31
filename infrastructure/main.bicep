param location string = resourceGroup().location
param appName string = 'sms-enterprise-app'

resource storage 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: toLower('${appName}stg')
  location: location
  sku: { name: 'Standard_LRS' }
  kind: 'StorageV2'
}

resource plan 'Microsoft.Web/serverfarms@2023-01-01' = {
  name: '${appName}-plan'
  location: location
  sku: { name: 'Y1', tier: 'Dynamic' }
}

resource functions 'Microsoft.Web/sites@2023-01-01' = {
  name: '${appName}-api'
  location: location
  kind: 'functionapp'
  properties: { serverFarmId: plan.id }
}
