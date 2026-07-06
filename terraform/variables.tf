variable "os_auth_url" {
  default = "https://auth.cloud.ovh.net/v3"
}

variable "os_tenant_id" {
  default = "3d8a391267364798a7e1dfb1c2f64ef0"
}

variable "os_tenant_name" {
  default = "9321996335937475"
}

variable "os_username" {
  default = "user-vMq3GdW76ckJ"
}

variable "os_password" {
  sensitive = true
}

variable "os_region" {
  default = "EU-WEST-PAR"
}

variable "ssh_public_key" {
  default = "~/.ssh/id_rsa.pub"
}
