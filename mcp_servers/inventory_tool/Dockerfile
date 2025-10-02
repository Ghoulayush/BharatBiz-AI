# mcp_servers/inventory_tool/Dockerfile
FROM python:3.11-slim
WORKDIR /app

# Install git (if needed for other dependencies)
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

# Install the MCP Python package from PyPI
RUN pip install mcp

COPY server.py .
CMD ["python", "server.py"]