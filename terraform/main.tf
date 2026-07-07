resource "openstack_compute_keypair_v2" "scoreops_key" {
  name       = "scoreops-key"
  public_key = file(var.ssh_public_key)
}

resource "openstack_compute_instance_v2" "scoreops" {
  name            = "scoreops-server"
  image_name      = "Debian 12"
  flavor_name     = "b3-8"
  key_pair        = openstack_compute_keypair_v2.scoreops_key.name
  security_groups = ["default"]

  network {
    name = "Ext-Net"
  }
}

output "server_ip" {
  value = openstack_compute_instance_v2.scoreops.access_ip_v4
}


resource "terraform_data" "run_ansible" {
  depends_on = [openstack_compute_instance_v2.scoreops]

  provisioner "local-exec" {
    command = <<-EOT
      echo "[scoreops]" > ../ansible/inventory.ini
      echo "${openstack_compute_instance_v2.scoreops.access_ip_v4} ansible_user=debian ansible_ssh_private_key_file=~/.ssh/id_rsa" >> ../ansible/inventory.ini
      sleep 30
      cd ../ansible && ANSIBLE_HOST_KEY_CHECKING=False ansible-playbook -i inventory.ini playbook.yml
    EOT
  }
}
