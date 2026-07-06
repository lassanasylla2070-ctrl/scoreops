terraform {
  required_providers {
    openstack = {
      source  = "terraform-provider-openstack/openstack"
      version = "~> 3.0"
    }
  }
}

provider "openstack" {
  auth_url    = var.os_auth_url
  tenant_id   = var.os_tenant_id
  tenant_name = var.os_tenant_name
  user_name   = var.os_username
  password    = var.os_password
  region      = var.os_region
}
