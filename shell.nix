{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = with pkgs; [
    nodejs-18_x
    yarn
  ];

  shellHook = ''
    echo AUTH-API
  '';

  NODE_ENV = "development";
}
