
import { ProtoRouteNode } from "../types/proto-mock";
import { RouteNode } from "../types";

const mapProtoRouteNode = (node: ProtoRouteNode): RouteNode => {
    return {
        id: node.id,
        name: node.name,
        segment: node.segment,
        fullPath: node.fullPath,
        type: node.type === 1 ? 'STATIC' : node.type === 2 ? 'DYNAMIC' : node.type === 3 ? 'CATCH_ALL' : 'STATIC', // Simple mapping
        pageId: node.pageId,
        layoutId: node.layoutId,
        children: node.children ? node.children.map(mapProtoRouteNode) : []
    };
};
