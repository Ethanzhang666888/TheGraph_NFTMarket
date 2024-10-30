import {
  Cancel as CancelEvent,
  List as ListEvent,
  Sold as SoldEvent
} from "../generated/NFTmk/NFTmk"
import {
  sellOrder,
  buyOreder,
} from "../generated/schema"

// 挂单，取消，过期；三种状态
export function handleList(event: ListEvent): void {

  //数据库list表记录
  let entity = new sellOrder(event.params.orderId)
  entity.nft = event.params.nft
  entity.tokenId = event.params.tokenId
  entity.seller = event.params.seller
  entity.payToken = event.params.payToken
  entity.price = event.params.price
  entity.deadline = event.params.deadline

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.status = "pending"

  entity.save()
}


export function handleSold(event: SoldEvent): void {
  let entity = new buyOreder(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.sellorderId = event.params.orderId
  entity.buyer = event.params.buyer
  entity.fee = event.params.fee

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

   let sellorderInfo = sellOrder.load(event.params.orderId)
   sellorderInfo!.status = "sold"

  entity.save()
}

export function handleCancel(event: CancelEvent): void {
  let sellorderInfo = sellOrder.load( event.params.orderId )
  sellorderInfo!.status = "cancel"
  sellorderInfo!.save()
}