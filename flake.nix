{
  description = "Project generated from default flake template";

  inputs = {
    nixpkgs.url = "nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = {
    self,
    nixpkgs,
    flake-utils,
  } @ inputs:
    flake-utils.lib.eachDefaultSystem (
      system: let
        pkgs = nixpkgs.legacyPackages.${system};
      in rec {
        formatter = pkgs.alejandra;

        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [];

          nativeBuildInputs = with pkgs; [
            bun
            nodejs_23
            watchexec
          ];

          shellHook = ''
            bun prettier . --write
          '';
        };
      }
    );
}
